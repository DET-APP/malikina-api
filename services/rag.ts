import { pool } from '../db/config.js';
import { getEmbedding } from './embeddings.js';

export interface RagChunk {
  id: string;
  source: string;
  title: string;
  content: string;
  language: string;
  similarity: number;
  metadata: any;
}

export async function searchKnowledge(query: string, limit = 5): Promise<RagChunk[]> {
  const embedding = await getEmbedding(query);
  const vector = `[${embedding.join(',')}]`;

  const result = await pool.query(
    `SELECT id, source, title, content, language, metadata,
            1 - (embedding <=> $1::vector) AS similarity
     FROM knowledge_chunks
     WHERE 1 - (embedding <=> $1::vector) > 0.3
     ORDER BY embedding <=> $1::vector
     LIMIT $2`,
    [vector, limit]
  );
  return result.rows;
}

// Recherche hybride : vectorielle + full-text pour meilleure précision
export async function searchKnowledgeHybrid(query: string, limit = 5): Promise<RagChunk[]> {
  const embedding = await getEmbedding(query);
  const vector = `[${embedding.join(',')}]`;

  const result = await pool.query(
    `SELECT id, source, title, content, language, metadata,
            (0.7 * (1 - (embedding <=> $1::vector)) +
             0.3 * COALESCE(ts_rank(to_tsvector('simple', content), plainto_tsquery('simple', $2)), 0)) AS similarity
     FROM knowledge_chunks
     ORDER BY similarity DESC
     LIMIT $3`,
    [vector, query, limit]
  );
  return result.rows.filter((r: any) => r.similarity > 0.2);
}

export function buildContext(chunks: RagChunk[]): string {
  return chunks
    .map((c, i) =>
      `[Source ${i + 1}: ${c.source}${c.title ? ' — ' + c.title : ''}]\n${c.content}`
    )
    .join('\n\n---\n\n');
}
