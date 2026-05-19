import axios from 'axios';
import pg from 'pg';

const { Pool } = pg;

// Configuration directe - contourne db/config.ts
const pool = new Pool({
    host: 'localhost',
    port: 5434,
    user: 'malikina',
    password: 'malikina',
    database: 'malikina'
});

const EXTERNAL_API = 'https://165-245-211-201.sslip.io/api';

async function importXassidas() {
    console.log('🔄 Import des xassidas depuis:', EXTERNAL_API);

    try {
        // Tester la connexion
        const testResult = await pool.query('SELECT NOW()');
        console.log('✅ PostgreSQL connecté sur le port 5434\n');

        // Récupérer les données
        const response = await axios.get(`${EXTERNAL_API}/xassidas`);
        const xassidas = response.data;

        console.log(`📊 ${xassidas.length} xassidas récupérés\n`);

        let imported = 0;
        let errors = 0;

        for (const x of xassidas) {
            try {
                // Insérer l'auteur si nécessaire
                if (x.author_id && x.author_name) {
                    await pool.query(
                        `INSERT INTO authors (id, name) 
             VALUES ($1, $2) 
             ON CONFLICT (id) DO NOTHING`,
                        [x.author_id.toString(), x.author_name]
                    );
                }

                // Insérer la xassida
                await pool.query(
                    `INSERT INTO xassidas 
           (id, title, description, arabic_name, categorie, verse_count, 
            actual_verse_count, is_visible, is_fiqh, author_id, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (id) DO UPDATE SET
             title = EXCLUDED.title,
             description = EXCLUDED.description,
             verse_count = EXCLUDED.verse_count,
             author_id = EXCLUDED.author_id`,
                    [
                        x.id.toString(),
                        x.title,
                        x.description || '',
                        x.arabic_name || '',
                        x.categorie || 'Général',
                        x.verse_count || 0,
                        x.actual_verse_count || x.verse_count?.toString() || '0',
                        x.is_visible !== false,
                        x.is_fiqh || false,
                        x.author_id?.toString() || null,
                        x.created_at || new Date().toISOString()
                    ]
                );

                imported++;
                process.stdout.write(`\r✅ ${imported}/${xassidas.length} : ${x.title.substring(0, 45)}`);

            } catch (err) {
                errors++;
                console.error(`\n❌ ${x.title}:`, err.message);
            }
        }

        console.log(`\n\n📊 Résumé:`);
        console.log(`   ✅ Importés: ${imported}`);
        console.log(`   ❌ Erreurs: ${errors}`);

        const result = await pool.query('SELECT COUNT(*) FROM xassidas');
        console.log(`\n📚 Total dans la base: ${result.rows[0].count} xassidas`);

    } catch (error) {
        console.error('❌ Erreur:', error.message);
        if (error.code) console.error('   Code:', error.code);
    }

    await pool.end();
    process.exit(0);
}

importXassidas();