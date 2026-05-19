import axios from 'axios';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  port: 5434,
  user: 'malikina',
  password: 'malikina',
  database: 'malikina'
});

const EXTERNAL_API = 'https://165-245-211-201.sslip.io/api';

async function importAllVerses() {
  console.log('🚀 Démarrage de l\'import des versets...\n');
  
  try {
    // Récupérer toutes les xassidas
    console.log('📡 Récupération de la liste des xassidas...');
    const xassidasRes = await axios.get(`${EXTERNAL_API}/xassidas`);
    const xassidas = xassidasRes.data;
    console.log(`✅ ${xassidas.length} xassidas trouvées\n`);
    
    let totalVerses = 0;
    let xassidasWithVerses = 0;
    
    for (const x of xassidas) {
      try {
        // Récupérer les versets pour cette xassida
        const versesRes = await axios.get(`${EXTERNAL_API}/xassidas/${x.id}/verses`, {
          timeout: 10000
        });
        
        const verses = versesRes.data;
        
        if (verses && verses.length > 0) {
          let versesImported = 0;
          
          for (const v of verses) {
            const verseNum = v.verse_number;
            if (!verseNum) continue;
            
            const textArab = v.text_arabic || '';
            if (!textArab) continue;
            
            // Vérifier si le verset existe déjà
            const check = await pool.query(
              'SELECT id FROM verses WHERE xassida_id = $1 AND verse_number = $2',
              [parseInt(x.id), verseNum]
            );
            
            if (check.rows.length === 0) {
              await pool.query(
                `INSERT INTO verses 
                 (xassida_id, verse_number, text_arabic, transcription, content, chapter_number, verse_key)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                  parseInt(x.id),
                  verseNum,
                  textArab,
                  v.transcription || '',
                  textArab,  // content = text_arabic
                  v.chapter_number || 1,
                  v.verse_key || `${v.chapter_number || 1}:${verseNum}`
                ]
              );
              versesImported++;
            }
          }
          
          if (versesImported > 0) {
            totalVerses += versesImported;
            xassidasWithVerses++;
            console.log(`✅ ${x.title}: ${versesImported} versets importés`);
            
            // Mettre à jour le compteur
            await pool.query(
              `UPDATE xassidas SET verse_count = $1 WHERE id = $2`,
              [versesImported, parseInt(x.id)]
            );
          }
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          console.log(`⚠️ ${x.title}: aucun verset trouvé`);
        } else {
          console.log(`⚠️ ${x.title}: ${err.message}`);
        }
      }
      
      // Petit délai
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.log(`\n📊 Résumé de l'import:`);
    console.log(`   ✅ Xassidas avec versets: ${xassidasWithVerses}/${xassidas.length}`);
    console.log(`   📖 Total versets importés: ${totalVerses}`);
    
    // Vérification finale
    const result = await pool.query(`
      SELECT COUNT(DISTINCT xassida_id) as xassidas_count, COUNT(*) as verses_count 
      FROM verses
    `);
    console.log(`\n📚 Base de données:`);
    console.log(`   Xassidas avec versets: ${result.rows[0].xassidas_count}`);
    console.log(`   Total versets: ${result.rows[0].verses_count}`);
    
  } catch (error) {
    console.error('❌ Erreur:', (error as Error).message);
  }
  
  await pool.end();
  process.exit(0);
}

importAllVerses();
