/**
 * Script exécuté LOCALEMENT — génère les embeddings via HF
 * puis insère directement en DB via SSH tunnel ou connexion directe
 *
 * Usage: DB_HOST=165.245.211.201 DB_PORT=5432 DB_USER=malikina DB_PASSWORD=xxx DB_NAME=malikina tsx scripts/import-knowledge-local.ts
 *
 * Ou avec SSH tunnel préalable:
 * ssh -L 5433:localhost:5432 root@165.245.211.201
 * DB_HOST=localhost DB_PORT=5433 ... tsx scripts/import-knowledge-local.ts
 */
import pg from 'pg';
import axios from 'axios';

const HF_API_KEY = process.env.HF_API_KEY || '';
const EMBED_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';

const pool = new pg.Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5433'),
  user:     process.env.DB_USER     || 'malikina',
  password: process.env.DB_PASSWORD || 'malikina',
  database: process.env.DB_NAME     || 'malikina',
});

async function getEmbedding(text: string): Promise<number[]> {
  const clean = text.replace(/\n+/g, ' ').trim().slice(0, 512);
  const res = await axios.post(
    `https://api-inference.huggingface.co/models/${EMBED_MODEL}`,
    { inputs: clean },
    { headers: { Authorization: `Bearer ${HF_API_KEY}` }, timeout: 20000 }
  );
  const data = res.data;
  return Array.isArray(data[0]) ? data[0] : data;
}

// ── Textes tidianes ──────────────────────────────────────────────────────────

const CHUNKS = [
  { source: "Jawahirul Ma'ani", title: "Origine de la Tariqa Tijaniyya", language: 'fr', content: `La Tariqa Tijaniyya a été fondée par Cheikh Ahmad ibn Muhammad al-Tijani (1737-1815), né à Ain Madhi en Algérie. Le Cheikh reçut la voie directement du Prophète Muhammad (sallallahu alayhi wa sallam) en état de veille, non en rêve. Cette transmission directe est l'un des fondements de la spécificité de la Tariqa Tijaniyya.`, metadata: { chapter: 'Introduction', page: 1 } },
  { source: "Jawahirul Ma'ani", title: "Les piliers du Wird Tidiaan", language: 'fr', content: `Le Wird Tidiaan comprend trois parties essentielles pratiquées deux fois par jour (matin et soir) : 1) L'Istighfar (demande de pardon) : "Astaghfirullah" 100 fois. 2) La Salat al-Fatihi : invocation de bénédictions sur le Prophète, récitée 100 fois. Elle est considérée équivalente à 6000 fois la Salat ordinaire selon les traditions de la voie. 3) La Haylala : "La ilaha illallah" 100 fois, puis Khatm al-Aqdar une fois.`, metadata: { chapter: 'Wird', page: 45 } },
  { source: "Jawahirul Ma'ani", title: "La Salat al-Fatihi — Vertu et signification", language: 'fr', content: `La Salat al-Fatihi (اللهم صل على سيدنا محمد الفاتح لما أغلق) est la prière centrale de la Tariqa Tijaniyya. Elle signifie : "Ô Allah, envoie Tes bénédictions sur notre Seigneur Muhammad, celui qui a ouvert ce qui était fermé, le sceau de ce qui a précédé, le défenseur de la vérité par la vérité, et le guide vers Ta droite voie." Cette invocation fut transmise au Cheikh Tijani par le Prophète lui-même.`, metadata: { chapter: 'Salat al-Fatihi', page: 67 } },
  { source: "Jawahirul Ma'ani", title: "Conditions d'appartenance à la Tariqa", language: 'fr', content: `Pour appartenir à la Tariqa Tijaniyya, le disciple doit : 1) Recevoir la wird des mains d'un Muqaddam autorisé. 2) S'engager à accomplir le wird quotidien sans interruption. 3) Ne pas pratiquer une autre tariqa simultanément. 4) Respecter les conditions posées par le Cheikh fondateur. L'abandon de la wird sans excuse valable équivaut à quitter la voie.`, metadata: { chapter: 'Conditions', page: 89 } },
  { source: "Munyat al-Murid", title: "Le désir du disciple — Introduction", language: 'fr', content: `Munyat al-Murid (Le désir du disciple) est l'un des ouvrages fondamentaux de la Tariqa Tijaniyya, rédigé par Cheikh Ahmad Skirej. Il expose les règles de conduite du murid (aspirant spirituel) sur la voie. Le murid doit cultiver la sincérité (ikhlas), l'abandon à Dieu (tawakkul) et la déférence envers son maître spirituel (shaykh).`, metadata: { chapter: 'Introduction', page: 1 } },
  { source: "Munyat al-Murid", title: "L'adab du disciple envers le Cheikh", language: 'fr', content: `L'adab (comportement) envers le cheikh comprend : le respect total de sa parole, la présence aux réunions du Wazifa et Hadra, l'amour sincère sans ostentation. Le disciple ne doit pas critiquer son cheikh même s'il lui semble voir une faute, car il manque de la vision spirituelle nécessaire. La relation avec le cheikh est une relation de cœur avant d'être une relation de forme.`, metadata: { chapter: 'Adab', page: 34 } },
  { source: "Munyat al-Murid", title: "La Wazifa — Description et règles", language: 'fr', content: `La Wazifa est la récitation collective ou individuelle comprenant : Astaghfirullah (30 fois), Salat al-Fatihi (50 fois), La ilaha illallah (100 fois), Jawharatul Kamal (12 fois) et Khatm al-Aqdar. Elle se pratique de préférence en groupe (Hadra) après la prière de l'après-midi ('Asr) le vendredi, mais peut se faire individuellement. La Wazifa est distincte du wird quotidien.`, metadata: { chapter: 'Wazifa', page: 56 } },
  { source: "Fakihat al-Tulab", title: "Introduction à Fakihat al-Tulab", language: 'fr', content: `Fakihat al-Tulab (Fruit des disciples) est un traité de Cheikh Ahmad Tijani sur les fondements spirituels de la voie. Il y explique les degrés de la walaya (sainteté) et la hiérarchie spirituelle dans la Tariqa. L'ouvrage est considéré comme une référence pour comprendre la doctrine de la khatmiyya (sceau de la walaya).`, metadata: { chapter: 'Introduction', page: 1 } },
  { source: "Fakihat al-Tulab", title: "La Khatmiyya — Le sceau de la walaya", language: 'fr', content: `Cheikh Ahmad Tijani est désigné dans la doctrine tijaniyya comme le Khatm al-Awliya (Sceau des saints), de même que Muhammad (saws) est le Khatm al-Anbiya (Sceau des prophètes). Cette doctrine signifie que la voie tijaniyya représente le sommet de la chaîne spirituelle soufie dans cette époque.`, metadata: { chapter: 'Khatmiyya', page: 23 } },
  { source: "Seydi El Hadji Malick Sy — Biographie et œuvres", title: "Biographie de Seydi El Hadji Malick Sy", language: 'fr', content: `Seydi El Hadji Malick Sy (1855-1922) est le principal propagateur de la Tariqa Tijaniyya au Sénégal et en Afrique de l'Ouest. Né à Gallé Thioro (région de Podor), il s'installe à Tivaouane qui devient le principal centre tidiaan du Sénégal. Érudit accompli, il maîtrisait l'arabe, les sciences islamiques et la poésie. Il est l'auteur de nombreux xassidas en wolof et en arabe, et de plusieurs traités théologiques.`, metadata: { author: 'Seydi El Hadji Malick Sy', type: 'biographie' } },
  { source: "Seydi El Hadji Malick Sy — Biographie et œuvres", title: "Rôle de Seydi Malick Sy dans la diffusion de l'Islam", language: 'fr', content: `Seydi Malick Sy a joué un rôle crucial dans l'islamisation pacifique du Sénégal. Il prônait la tolérance, le savoir et la coexistence avec l'autorité coloniale française, non par soumission, mais pour préserver les communautés musulmanes. Son approche pédagogique a permis l'expansion de l'éducation islamique au Sénégal. Il fonda des daara (écoles coraniques) dans tout le pays et forma des générations d'érudits.`, metadata: { author: 'Seydi El Hadji Malick Sy', type: 'histoire' } },
  { source: "Seydi El Hadji Malick Sy — Biographie et œuvres", title: "Les xassidas de Seydi Malick Sy", language: 'fr', content: `Seydi El Hadji Malick Sy est l'auteur de nombreux xassidas (poèmes religieux) en arabe et en wolof. Ses œuvres poétiques majeures incluent : Mawlid al-Mustafa (sur la naissance du Prophète), Isawa (sur la voie soufie), Tabat al-Abwab, et de nombreux poèmes en wolof sur la louange prophétique et les enseignements tidiaans. Ces xassidas sont récités lors des cérémonies religieuses, notamment le Gamou (Mawlid) de Tivaouane.`, metadata: { author: 'Seydi El Hadji Malick Sy', type: 'xassidas' } },
  { source: "Seydi El Hadji Malick Sy — Biographie et œuvres", title: "Le Gamou de Tivaouane", language: 'fr', content: `Le Gamou (célébration du Mawlid an-Nabi) de Tivaouane est l'un des plus grands rassemblements islamiques d'Afrique de l'Ouest, réunissant chaque année des millions de fidèles à la date anniversaire de la naissance du Prophète Muhammad (sallallahu alayhi wa sallam). Il a été institué par Seydi El Hadji Malick Sy et est perpétué par ses successeurs (khalifes). Le Gamou comprend des récitations de Coran, de xassidas, de conférences religieuses et des prières collectives.`, metadata: { author: 'Seydi El Hadji Malick Sy', type: 'événement' } },
  { source: "Seydi El Hadji Malick Sy — Biographie et œuvres", title: "Jurisprudence tidiaan — Relations avec les autres voies", language: 'fr', content: `La Tariqa Tijaniyya, contrairement à d'autres voies soufies, interdit à ses membres d'appartenir simultanément à une autre tariqa. Cette règle (shart al-iltizam) est fondamentale et distingue la voie tijaniyya. Cependant, le respect mutuel envers les autres voies soufies et leurs maîtres est fortement recommandé. Seydi Malick Sy enseignait que la voie ne doit jamais être source de division entre musulmans.`, metadata: { type: 'jurisprudence' } },
  { source: "Doctrine et pratiques tidianes", title: "La Hadra — Réunion spirituelle", language: 'fr', content: `La Hadra (présence spirituelle) est la réunion collective des tidiaans pour la récitation de la Wazifa, généralement le vendredi après 'Asr. Elle comprend la récitation collective des dhikrs, parfois accompagnée de chants religieux (xassidas). La Hadra renforce le lien fraternel entre les disciples et est considérée comme une occasion de bénédictions spirituelles particulières.`, metadata: { type: 'pratiques' } },
  { source: "Doctrine et pratiques tidianes", title: "Le Muqaddam — Représentant autorisé", language: 'fr', content: `Le Muqaddam est un représentant autorisé par la chaîne d'autorisation (ijaza) à transmettre le wird tidiaan. Il doit avoir reçu l'autorisation d'un Muqaddam précédent, remontant jusqu'au Cheikh fondateur. Le Muqaddam enseigne le wird aux nouveaux disciples et guide leur formation spirituelle. Au Sénégal, la chaîne passe principalement par Seydi El Hadji Malick Sy et ses successeurs à Tivaouane.`, metadata: { type: 'doctrine' } },
  { source: "Doctrine et pratiques tidianes", title: "La Jawharatul Kamal — Joyau de la perfection", language: 'fr', content: `La Jawharatul Kamal (جوهرة الكمال) est une invocation particulière de la Tariqa Tijaniyya, transmise directement par le Prophète (saws) au Cheikh fondateur. Elle est récitée 12 fois lors de la Wazifa. Cette invocation est considérée comme la plus haute forme de salawat dans la voie et son mérite est incommensurable selon les maîtres tidiaans. Elle ne doit être récitée que par ceux qui ont reçu l'autorisation.`, metadata: { type: 'pratiques' } },
];

async function run() {
  const skipEmbeddings = process.env.SKIP_EMBEDDINGS === '1';
  console.log(`🌱 Import de ${CHUNKS.length} chunks ${skipEmbeddings ? 'SANS embeddings (full-text fallback)' : 'avec embeddings HuggingFace'}...`);

  let inserted = 0;
  for (let i = 0; i < CHUNKS.length; i++) {
    const chunk = CHUNKS[i];
    process.stdout.write(`[${i + 1}/${CHUNKS.length}] ${chunk.title.slice(0, 50)}... `);

    // Vérifier doublon
    const dup = await pool.query(
      'SELECT id FROM knowledge_chunks WHERE source = $1 AND title = $2 LIMIT 1',
      [chunk.source, chunk.title]
    );
    if (dup.rows.length > 0) { console.log('déjà importé'); continue; }

    if (skipEmbeddings) {
      await pool.query(
        `INSERT INTO knowledge_chunks (source, title, language, content, metadata)
         VALUES ($1, $2, $3, $4, $5)`,
        [chunk.source, chunk.title, chunk.language, chunk.content, JSON.stringify(chunk.metadata)]
      );
      inserted++;
      console.log('OK');
      continue;
    }

    // Générer embedding
    let embedding: number[];
    try {
      embedding = await getEmbedding(chunk.content);
    } catch (e: any) {
      console.log(`ERR embedding: ${e.message}`);
      continue;
    }

    const vector = `[${embedding.join(',')}]`;
    await pool.query(
      `INSERT INTO knowledge_chunks (source, title, language, content, embedding, metadata)
       VALUES ($1, $2, $3, $4, $5::vector, $6)`,
      [chunk.source, chunk.title, chunk.language, chunk.content, vector, JSON.stringify(chunk.metadata)]
    );
    inserted++;
    console.log('OK (vec)');

    // Pause pour éviter rate limit HF
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`\n${inserted} chunks importés.`);
  await pool.end();
}

run().catch(e => { console.error('❌', e.message); process.exit(1); });
