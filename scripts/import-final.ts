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

interface XassidaFromAPI {
    id: string;
    title: string;
    description: string | null;
    arabic_name: string;
    categorie: string;
    verse_count: number;
    author_id: string;
    author_name: string;
    created_at: string;
}

async function importXassidas(): Promise<void> {
    console.log('🔄 Import des xassidas...\n');

    try {
        const response = await axios.get<XassidaFromAPI[]>('https://165-245-211-201.sslip.io/api/xassidas');
        const xassidas = response.data;

        console.log(`📊 ${xassidas.length} xassidas trouvés\n`);

        let count = 0;

        for (const x of xassidas) {
            try {
                await pool.query(
                    `INSERT INTO xassidas (id, title, description, verse_count, author_id)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO UPDATE SET 
             title = EXCLUDED.title,
             description = EXCLUDED.description,
             verse_count = EXCLUDED.verse_count`,
                    [
                        parseInt(x.id),
                        x.title,
                        x.description || '',
                        x.verse_count || 0,
                        x.author_id ? parseInt(x.author_id) : null
                    ]
                );

                count++;
                process.stdout.write(`\r✅ ${count}/${xassidas.length} : ${x.title.substring(0, 50)}`);

            } catch (err) {
                console.error(`\n❌ ${x.title}:`, (err as Error).message);
            }
        }

        console.log(`\n\n✨ ${count} xassidas importés !`);

        const result = await pool.query('SELECT COUNT(*) FROM xassidas');
        console.log(`📚 Total dans la base: ${result.rows[0].count}`);

    } catch (error) {
        console.error('❌ Erreur:', (error as Error).message);
    }

    await pool.end();
    process.exit(0);
}

importXassidas();