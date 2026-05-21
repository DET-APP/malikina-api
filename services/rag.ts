import { pool } from '../db/config.js';

export interface RagChunk {
  id: string;
  source: string;
  title: string;
  content: string;
  language: string;
  similarity: number;
  metadata: any;
}

// Recherche full-text (fonctionne sans embeddings)
async function searchFullText(query: string, limit: number): Promise<RagChunk[]> {
  const result = await pool.query(
    `SELECT id, source, title, content, language, metadata,
            ts_rank(to_tsvector('simple', content || ' ' || COALESCE(title, '')),
                    plainto_tsquery('simple', $1)) AS similarity
     FROM knowledge_chunks
     WHERE to_tsvector('simple', content || ' ' || COALESCE(title, ''))
           @@ plainto_tsquery('simple', $1)
     ORDER BY similarity DESC
     LIMIT $2`,
    [query, limit]
  );

  // Si pas de résultats full-text, retourne les plus récents comme fallback
  if (result.rows.length === 0) {
    const fallback = await pool.query(
      `SELECT id, source, title, content, language, metadata, 0.1 AS similarity
       FROM knowledge_chunks
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit]
    );
    return fallback.rows;
  }
  return result.rows;
}

// Recherche vectorielle (nécessite embeddings)
async function searchVector(query: string, limit: number): Promise<RagChunk[]> {
  try {
    const { getEmbedding } = await import('./embeddings.js');
    const embedding = await getEmbedding(query);
    const vector = `[${embedding.join(',')}]`;

    const result = await pool.query(
      `SELECT id, source, title, content, language, metadata,
              1 - (embedding <=> $1::vector) AS similarity
       FROM knowledge_chunks
       WHERE embedding IS NOT NULL
         AND 1 - (embedding <=> $1::vector) > 0.25
       ORDER BY embedding <=> $1::vector
       LIMIT $2`,
      [vector, limit]
    );
    return result.rows;
  } catch {
    return [];
  }
}

// Recherche hybride : vectorielle si dispo, sinon full-text
export async function searchKnowledgeHybrid(query: string, limit = 5): Promise<RagChunk[]> {
  // Vérifie si des embeddings existent
  const hasEmbeddings = await pool.query(
    'SELECT 1 FROM knowledge_chunks WHERE embedding IS NOT NULL LIMIT 1'
  );

  if (hasEmbeddings.rows.length > 0) {
    const [vectorResults, ftResults] = await Promise.all([
      searchVector(query, limit),
      searchFullText(query, limit),
    ]);

    // Fusionner et dédupliquer par id, priorité au vecteur
    const seen = new Set<string>();
    const merged: RagChunk[] = [];
    for (const r of [...vectorResults, ...ftResults]) {
      if (!seen.has(r.id)) { seen.add(r.id); merged.push(r); }
    }
    return merged.slice(0, limit);
  }

  // Pas d'embeddings — full-text uniquement
  return searchFullText(query, limit);
}

export function buildContext(chunks: RagChunk[]): string {
  return chunks
    .map((c, i) =>
      `[Source ${i + 1}: ${c.source}${c.title ? ' — ' + c.title : ''}]\n${c.content}`
    )
    .join('\n\n---\n\n');
}
