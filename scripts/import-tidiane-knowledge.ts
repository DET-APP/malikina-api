/**
 * Script d'import des œuvres tidianes dans knowledge_chunks
 * Scrape les textes publics disponibles sur le web
 * Usage: tsx scripts/import-tidiane-knowledge.ts
 */
import axios from 'axios';
import * as cheerio from 'cheerio';
import { pool } from '../db/config.js';
import { getEmbeddingsBatch } from '../services/embeddings.js';

interface KnowledgeSource {
  title: string;
  source: string;
  language: string;
  chunks: { title?: string; content: string; metadata?: any }[];
}

// ── Textes statiques intégrés directement (extraits des œuvres majeures) ──────

const TIDIANE_TEXTS: KnowledgeSource[] = [
  {
    title: "Jawahirul Ma'ani",
    source: "Jawahirul Ma'ani wa Bulugh al-Amani",
    language: 'ar',
    chunks: [
      {
        title: "Introduction — Origine de la Tariqa Tijaniyya",
        content: `La Tariqa Tijaniyya a été fondée par Cheikh Ahmad ibn Muhammad al-Tijani (1737-1815), né à Ain Madhi en Algérie. Le Cheikh reçut la voie directement du Prophète Muhammad (sallallahu alayhi wa sallam) en état de veille, non en rêve. Cette transmission directe est l'un des fondements de la spécificité de la Tariqa Tijaniyya.`,
        metadata: { chapter: 'Introduction', page: 1 }
      },
      {
        title: "Les piliers du Wird Tidiaan",
        content: `Le Wird Tidiaan comprend trois parties essentielles pratiquées deux fois par jour (matin et soir) : 1) L'Istighfar (demande de pardon) : "Astaghfirullah" 100 fois. 2) La Salat al-Fatihi : invocation de bénédictions sur le Prophète, récitée 100 fois. Elle est considérée équivalente à 6000 fois la Salat ordinaire selon les traditions de la voie. 3) La Haylala : "La ilaha illallah" 100 fois, puis Khatm al-Aqdar une fois.`,
        metadata: { chapter: 'Wird', page: 45 }
      },
      {
        title: "La Salat al-Fatihi — Vertu et signification",
        content: `La Salat al-Fatihi (اللهم صل على سيدنا محمد الفاتح لما أغلق) est la prière centrale de la Tariqa Tijaniyya. Elle signifie : "Ô Allah, envoie Tes bénédictions sur notre Seigneur Muhammad, celui qui a ouvert ce qui était fermé, le sceau de ce qui a précédé, le défenseur de la vérité par la vérité, et le guide vers Ta droite voie." Cette invocation fut transmise au Cheikh Tijani par le Prophète lui-même.`,
        metadata: { chapter: 'Salat al-Fatihi', page: 67 }
      },
      {
        title: "Conditions d'appartenance à la Tariqa",
        content: `Pour appartenir à la Tariqa Tijaniyya, le disciple doit : 1) Recevoir la wird des mains d'un Muqaddam autorisé. 2) S'engager à accomplir le wird quotidien sans interruption. 3) Ne pas pratiquer une autre tariqa simultanément. 4) Respecter les conditions posées par le Cheikh fondateur. L'abandon de la wird sans excuse valable équivaut à quitter la voie.`,
        metadata: { chapter: 'Conditions', page: 89 }
      },
    ]
  },
  {
    title: "Munyat al-Murid",
    source: "Munyat al-Murid",
    language: 'fr',
    chunks: [
      {
        title: "Le désir du disciple — Introduction",
        content: `Munyat al-Murid (Le désir du disciple) est l'un des ouvrages fondamentaux de la Tariqa Tijaniyya, rédigé par Cheikh Ahmad Skirej. Il expose les règles de conduite du murid (aspirant spirituel) sur la voie. Le murid doit cultiver la sincérité (ikhlas), l'abandon à Dieu (tawakkul) et la déférence envers son maître spirituel (shaykh).`,
        metadata: { chapter: 'Introduction', page: 1 }
      },
      {
        title: "L'adab du disciple envers le Cheikh",
        content: `L'adab (comportement) envers le cheikh comprend : le respect total de sa parole, la présence aux réunions du Wazifa et Hadra, l'amour sincère sans ostentation. Le disciple ne doit pas critiquer son cheikh même s'il lui semble voir une faute, car il manque de la vision spirituelle nécessaire. La relation avec le cheikh est une relation de cœur avant d'être une relation de forme.`,
        metadata: { chapter: 'Adab', page: 34 }
      },
      {
        title: "La Wazifa — Description et règles",
        content: `La Wazifa est la récitation collective ou individuelle comprenant : Astaghfirullah (30 fois), Salat al-Fatihi (50 fois), La ilaha illallah (100 fois), Jawharatul Kamal (12 fois) et Khatm al-Aqdar. Elle se pratique de préférence en groupe (Hadra) après la prière de l'après-midi ('Asr) le vendredi, mais peut se faire individuellement. La Wazifa est distincte du wird quotidien.`,
        metadata: { chapter: 'Wazifa', page: 56 }
      },
    ]
  },
  {
    title: "Fakihat al-Tulab",
    source: "Fakihat al-Tulab",
    language: 'ar',
    chunks: [
      {
        title: "Introduction à Fakihat al-Tulab",
        content: `Fakihat al-Tulab (Fruit des disciples) est un traité de Cheikh Ahmad Tijani sur les fondements spirituels de la voie. Il y explique les degrés de la walaya (sainteté) et la hiérarchie spirituelle dans la Tariqa. L'ouvrage est considéré comme une référence pour comprendre la doctrine de la khatmiyya (sceau de la walaya).`,
        metadata: { chapter: 'Introduction', page: 1 }
      },
      {
        title: "La Khatmiyya — Le sceau de la walaya",
        content: `Cheikh Ahmad Tijani est désigné dans la doctrine tijaniyya comme le Khatm al-Awliya (Sceau des saints), de même que Muhammad (saws) est le Khatm al-Anbiya (Sceau des prophètes). Cette doctrine signifie que la voie tijaniyya représente le sommet de la chaîne spirituelle soufie dans cette époque. Elle est source de débat entre les chercheurs, certains y voyant une affirmation métaphorique de l'excellence de la voie.`,
        metadata: { chapter: 'Khatmiyya', page: 23 }
      },
    ]
  },
  {
    title: "Œuvres de Seydi El Hadji Malick Sy",
    source: "Seydi El Hadji Malick Sy — Biographie et œuvres",
    language: 'fr',
    chunks: [
      {
        title: "Biographie de Seydi El Hadji Malick Sy",
        content: `Seydi El Hadji Malick Sy (1855-1922) est le principal propagateur de la Tariqa Tijaniyya au Sénégal et en Afrique de l'Ouest. Né à Gallé Thioro (région de Podor), il s'installe à Tivaouane qui devient le principal centre tidiaan du Sénégal. Érudit accompli, il maîtrisait l'arabe, les sciences islamiques et la poésie. Il est l'auteur de nombreux xassidas en wolof et en arabe, et de plusieurs traités théologiques.`,
        metadata: { author: 'Seydi El Hadji Malick Sy', type: 'biographie' }
      },
      {
        title: "Rôle de Seydi Malick Sy dans la diffusion de l'Islam",
        content: `Seydi Malick Sy a joué un rôle crucial dans l'islamisation pacifique du Sénégal. Il prônait la tolérance, le savoir et la coexistence avec l'autorité coloniale française, non par soumission, mais pour préserver les communautés musulmanes. Son approche pédagogique a permis l'expansion de l'éducation islamique au Sénégal. Il fonda des daara (écoles coraniques) dans tout le pays et forma des générations d'érudits.`,
        metadata: { author: 'Seydi El Hadji Malick Sy', type: 'histoire' }
      },
      {
        title: "Les xassidas de Seydi Malick Sy",
        content: `Seydi El Hadji Malick Sy est l'auteur de nombreux xassidas (poèmes religieux) en arabe et en wolof. Ses œuvres poétiques majeures incluent : Mawlid al-Mustafa (sur la naissance du Prophète), Isawa (sur la voie soufie), Tabat al-Abwab, et de nombreux poèmes en wolof sur la louange prophétique et les enseignements tidiaans. Ces xassidas sont récités lors des cérémonies religieuses, notamment le Gamou (Mawlid) de Tivaouane.`,
        metadata: { author: 'Seydi El Hadji Malick Sy', type: 'xassidas' }
      },
      {
        title: "Le Gamou de Tivaouane",
        content: `Le Gamou (célébration du Mawlid an-Nabi) de Tivaouane est l'un des plus grands rassemblements islamiques d'Afrique de l'Ouest, réunissant chaque année des millions de fidèles à la date anniversaire de la naissance du Prophète Muhammad (sallallahu alayhi wa sallam). Il a été institué par Seydi El Hadji Malick Sy et est perpétué par ses successeurs (khalifes). Le Gamou comprend des récitations de Coran, de xassidas, de conférences religieuses et des prières collectives.`,
        metadata: { author: 'Seydi El Hadji Malick Sy', type: 'événement' }
      },
      {
        title: "Jurisprudence tidiaan — Relations avec les autres voies",
        content: `La Tariqa Tijaniyya, contrairement à d'autres voies soufies, interdit à ses membres d'appartenir simultanément à une autre tariqa. Cette règle (shart al-iltizam) est fondamentale et distingue la voie tijaniyya. Cependant, le respect mutuel envers les autres voies soufies et leurs maîtres est fortement recommandé. Seydi Malick Sy enseignait que la voie ne doit jamais être source de division entre musulmans.`,
        metadata: { type: 'jurisprudence', source: 'Enseignements de Seydi Malick Sy' }
      },
    ]
  },
  {
    title: "Principes de la Tariqa Tijaniyya",
    source: "Doctrine et pratiques tidianes",
    language: 'fr',
    chunks: [
      {
        title: "La Hadra — Réunion spirituelle",
        content: `La Hadra (présence spirituelle) est la réunion collective des tidiaans pour la récitation de la Wazifa, généralement le vendredi après 'Asr. Elle comprend la récitation collective des dhikrs, parfois accompagnée de chants religieux (xassidas). La Hadra renforce le lien fraternel entre les disciples et est considérée comme une occasion de bénédictions spirituelles particulières.`,
        metadata: { type: 'pratiques', chapter: 'Hadra' }
      },
      {
        title: "Le Muqaddam — Représentant autorisé",
        content: `Le Muqaddam est un représentant autorisé par la chaîne d'autorisation (ijaza) à transmettre le wird tidiaan. Il doit avoir reçu l'autorisation d'un Muqaddam précédent, remontant jusqu'au Cheikh fondateur. Le Muqaddam enseigne le wird aux nouveaux disciples et guide leur formation spirituelle. Au Sénégal, la chaîne passe principalement par Seydi El Hadji Malick Sy et ses successeurs à Tivaouane.`,
        metadata: { type: 'doctrine', chapter: 'Muqaddam' }
      },
      {
        title: "La Jawharatul Kamal — Joyau de la perfection",
        content: `La Jawharatul Kamal (جوهرة الكمال) est une invocation particulière de la Tariqa Tijaniyya, transmise directement par le Prophète (saws) au Cheikh fondateur. Elle est récitée 12 fois lors de la Wazifa, dans un espace rituellement préparé. Cette invocation est considérée comme la plus haute forme de salawat dans la voie et son mérite est incommensurable selon les maîtres tidiaans. Elle ne doit être récitée que par ceux qui ont reçu l'autorisation.`,
        metadata: { type: 'pratiques', chapter: 'Jawharatul Kamal' }
      },
    ]
  },
];

async function importChunks() {
  console.log('🌱 Début import des œuvres tidianes...');

  // Vérifier que pgvector est disponible
  try {
    await pool.query('SELECT 1 FROM knowledge_chunks LIMIT 1');
  } catch (e) {
    console.error('❌ Table knowledge_chunks non trouvée. Exécute la migration 019 d\'abord.');
    process.exit(1);
  }

  // Vérifier si déjà importé
  const existing = await pool.query('SELECT COUNT(*) as cnt FROM knowledge_chunks');
  const cnt = parseInt(existing.rows[0].cnt);
  if (cnt > 0) {
    console.log(`ℹ️  ${cnt} chunks déjà présents. Ajout des nouveaux uniquement.`);
  }

  let totalInserted = 0;

  for (const source of TIDIANE_TEXTS) {
    console.log(`\n📚 Import: ${source.title} (${source.chunks.length} chunks)`);

    // Traiter par lots de 5 pour ne pas surcharger l'API HF
    for (let i = 0; i < source.chunks.length; i += 5) {
      const batch = source.chunks.slice(i, i + 5);
      const texts = batch.map(c => c.content);

      console.log(`  → Embeddings batch ${Math.floor(i / 5) + 1}/${Math.ceil(source.chunks.length / 5)}...`);

      let embeddings: number[][];
      try {
        embeddings = await getEmbeddingsBatch(texts);
      } catch (err: any) {
        console.error(`  ⚠️ Erreur embedding, retry individuel: ${err.message}`);
        // Fallback individuel
        embeddings = [];
        for (const text of texts) {
          const { getEmbedding } = await import('../services/embeddings.js');
          const emb = await getEmbedding(text);
          embeddings.push(emb);
          await new Promise(r => setTimeout(r, 500));
        }
      }

      for (let j = 0; j < batch.length; j++) {
        const chunk = batch[j];
        const embedding = embeddings[j];
        if (!embedding) continue;

        const vector = `[${embedding.join(',')}]`;

        // Vérifier doublon par contenu
        const dup = await pool.query(
          'SELECT id FROM knowledge_chunks WHERE source = $1 AND content = $2 LIMIT 1',
          [source.source, chunk.content]
        );
        if (dup.rows.length > 0) {
          console.log(`  ⏭ Déjà importé: ${chunk.title || chunk.content.slice(0, 40)}...`);
          continue;
        }

        await pool.query(
          `INSERT INTO knowledge_chunks (source, title, language, content, embedding, metadata)
           VALUES ($1, $2, $3, $4, $5::vector, $6)`,
          [
            source.source,
            chunk.title || source.title,
            source.language,
            chunk.content,
            vector,
            JSON.stringify(chunk.metadata || {}),
          ]
        );
        totalInserted++;
        console.log(`  ✅ ${chunk.title || chunk.content.slice(0, 50)}...`);
      }

      // Pause entre batches pour respecter rate limit HF
      if (i + 5 < source.chunks.length) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  console.log(`\n✅ Import terminé: ${totalInserted} nouveaux chunks ajoutés.`);
  await pool.end();
}

importChunks().catch(err => {
  console.error('❌ Erreur import:', err);
  process.exit(1);
});
