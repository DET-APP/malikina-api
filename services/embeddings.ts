import axios from 'axios';

const HF_API_KEY = process.env.HF_API_KEY || '';
const EMBED_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';

export async function getEmbedding(text: string): Promise<number[]> {
  const clean = text.replace(/\n+/g, ' ').trim().slice(0, 512);
  const res = await axios.post(
    `https://api-inference.huggingface.co/models/${EMBED_MODEL}`,
    { inputs: clean },
    {
      headers: { Authorization: `Bearer ${HF_API_KEY}` },
      timeout: 15000,
    }
  );
  // HF retourne un tableau de tableaux pour les inputs multiples
  const data = res.data;
  if (Array.isArray(data[0])) return data[0] as number[];
  return data as number[];
}

export async function getEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  const clean = texts.map(t => t.replace(/\n+/g, ' ').trim().slice(0, 512));
  const res = await axios.post(
    `https://api-inference.huggingface.co/models/${EMBED_MODEL}`,
    { inputs: clean },
    {
      headers: { Authorization: `Bearer ${HF_API_KEY}` },
      timeout: 30000,
    }
  );
  return res.data as number[][];
}
