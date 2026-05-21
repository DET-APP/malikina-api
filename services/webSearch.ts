import axios from 'axios';

export interface SearchResult {
  title: string;
  url: string;
  description: string;
}

// ── Wikipedia API (100% gratuit, sans clé) ────────────────────────────────────
const WIKI_HEADERS = {
  'User-Agent': 'MalikinaChatbot/1.0 (https://malikina.vercel.app; contact@malikina.app) axios/1.x',
};

async function searchWikipedia(query: string, count: number): Promise<SearchResult[]> {
  try {
    const searchRes = await axios.get('https://fr.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        list: 'search',
        srsearch: query,
        srlimit: count,
        format: 'json',
      },
      headers: WIKI_HEADERS,
      timeout: 8000,
    });

    const pages = searchRes.data?.query?.search || [];
    if (pages.length === 0) return [];

    const pageIds = pages.map((p: any) => p.pageid).join('|');
    const extractRes = await axios.get('https://fr.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        pageids: pageIds,
        prop: 'extracts|info',
        exintro: true,
        explaintext: true,
        inprop: 'url',
        format: 'json',
      },
      headers: WIKI_HEADERS,
      timeout: 8000,
    });

    const wikiPages = Object.values(extractRes.data?.query?.pages || {}) as any[];
    return wikiPages
      .filter((p: any) => p.extract && p.extract.length > 100)
      .map((p: any) => ({
        title: p.title,
        url: p.fullurl || `https://fr.wikipedia.org/wiki/${encodeURIComponent(p.title)}`,
        description: p.extract.slice(0, 1500).trim(),
      }));
  } catch (err: any) {
    console.warn('[WEB_SEARCH] Erreur Wikipedia:', err.message);
    return [];
  }
}

// ── DuckDuckGo Instant Answer API (100% gratuit, sans clé) ───────────────────
async function searchDuckDuckGo(query: string): Promise<SearchResult[]> {
  try {
    const res = await axios.get('https://api.duckduckgo.com/', {
      params: { q: query, format: 'json', no_html: 1, skip_disambig: 1, kl: 'fr-fr' },
      timeout: 8000,
      headers: { 'User-Agent': 'Malikina-App/1.0' },
    });

    const data = res.data;
    const results: SearchResult[] = [];

    // Réponse abstraite principale
    if (data.AbstractText && data.AbstractText.length > 100) {
      results.push({
        title: data.Heading || query,
        url: data.AbstractURL || data.AbstractSource || 'duckduckgo',
        description: data.AbstractText.slice(0, 1500),
      });
    }

    // Résultats relatifs
    for (const r of (data.RelatedTopics || []).slice(0, 4)) {
      if (r.Text && r.Text.length > 80 && r.FirstURL) {
        results.push({
          title: r.Text.split(' - ')[0]?.slice(0, 100) || query,
          url: r.FirstURL,
          description: r.Text.slice(0, 800),
        });
      }
    }

    return results;
  } catch (err: any) {
    console.warn('[WEB_SEARCH] Erreur DuckDuckGo:', err.message);
    return [];
  }
}

// ── Fonction principale : Wikipedia en priorité, DuckDuckGo en complément ─────
export async function searchWeb(query: string, count = 5): Promise<SearchResult[]> {
  const enrichedQuery = query.includes('tijan') || query.includes('islam') || query.includes('serigne') || query.includes('cheikh')
    ? query
    : `${query} Tijaniyya Islam Sénégal`;

  const [wikiResults, ddgResults] = await Promise.all([
    searchWikipedia(enrichedQuery, count),
    searchDuckDuckGo(enrichedQuery),
  ]);

  // Dédupliquer par titre
  const seen = new Set<string>();
  const all: SearchResult[] = [];
  for (const r of [...wikiResults, ...ddgResults]) {
    if (!seen.has(r.title) && r.description.length > 80) {
      seen.add(r.title);
      all.push(r);
    }
  }

  return all.slice(0, count);
}

// ── Recherche + stockage dans knowledge_chunks ────────────────────────────────
export async function searchAndStore(query: string, pool: any): Promise<number> {
  const results = await searchWeb(query);
  if (results.length === 0) return 0;

  let inserted = 0;
  for (const result of results) {
    try {
      const existing = await pool.query(
        'SELECT 1 FROM knowledge_chunks WHERE source = $1 AND title = $2 LIMIT 1',
        [result.url, result.title]
      );
      if (existing.rows.length > 0) continue;

      await pool.query(
        `INSERT INTO knowledge_chunks (source, title, content, language, metadata)
         VALUES ($1, $2, $3, 'fr', $4)`,
        [result.url, result.title, result.description, JSON.stringify({
          auto_enriched: true,
          query,
          fetched_at: new Date().toISOString(),
        })]
      );
      inserted++;
    } catch (err: any) {
      console.warn('[WEB_SEARCH] Erreur insertion:', err.message);
    }
  }

  if (inserted > 0) console.log(`[WEB_SEARCH] ${inserted} chunk(s) ajouté(s) pour: "${query}"`);
  return inserted;
}
