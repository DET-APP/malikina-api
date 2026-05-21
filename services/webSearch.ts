import axios from 'axios';

export interface SearchResult {
  title: string;
  url: string;
  description: string;
}

/**
 * Recherche web via Brave Search API (gratuite jusqu'à 2000 req/mois)
 * Retourne [] si BRAVE_API_KEY non configuré (dégradé gracieux)
 */
export async function searchWeb(query: string, count = 5): Promise<SearchResult[]> {
  const apiKey = process.env.BRAVE_API_KEY;

  if (!apiKey) {
    console.warn('[WEB_SEARCH] BRAVE_API_KEY non configuré — recherche web désactivée');
    return [];
  }

  try {
    const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
      headers: {
        'X-Subscription-Token': apiKey,
        'Accept': 'application/json',
      },
      params: {
        q: query,
        count,
        search_lang: 'fr',
        country: 'SN',
      },
      timeout: 8000,
    });

    const results: SearchResult[] = (response.data?.web?.results || []).map((r: any) => ({
      title: r.title || '',
      url: r.url || '',
      description: r.description || '',
    }));

    return results.filter(r => r.url && r.description && r.description.length > 20);
  } catch (err: any) {
    console.warn('[WEB_SEARCH] Erreur recherche Brave:', err.message);
    return [];
  }
}

/**
 * Recherche web et stockage des résultats dans knowledge_chunks.
 * Retourne le nombre de chunks effectivement insérés.
 */
export async function searchAndStore(query: string, pool: any): Promise<number> {
  const results = await searchWeb(query);

  if (results.length === 0) {
    return 0;
  }

  let inserted = 0;

  for (const result of results) {
    try {
      const metadata = {
        auto_enriched: true,
        query,
        fetched_at: new Date().toISOString(),
      };

      // Vérifier si le chunk existe déjà (éviter doublons même sans contrainte unique)
      const existing = await pool.query(
        `SELECT 1 FROM knowledge_chunks WHERE source = $1 AND title = $2 LIMIT 1`,
        [result.url, result.title]
      );

      if (existing.rows.length > 0) {
        continue;
      }

      await pool.query(
        `INSERT INTO knowledge_chunks (source, title, content, language, metadata)
         VALUES ($1, $2, $3, $4, $5)`,
        [result.url, result.title, result.description, 'fr', JSON.stringify(metadata)]
      );

      inserted++;
    } catch (err: any) {
      console.warn('[WEB_SEARCH] Erreur insertion chunk:', err.message);
    }
  }

  console.log(`[WEB_SEARCH] ${inserted}/${results.length} chunks insérés pour: "${query}"`);
  return inserted;
}
