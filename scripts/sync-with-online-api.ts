// scripts/sync-with-online-api.ts

import axios from 'axios';
import { pool } from '../db/config.js';

const EXTERNAL_API = process.env.EXTERNAL_API_URL || 'https://165-245-211-201.sslip.io/api';

interface Author {
    id: string;
    name: string;
    description?: string;
}

interface Xassida {
    id: string;
    title: string;
    description: string | null;
    arabic_name: string;
    audio_url: string;
    youtube_id: string;
    categorie: string;
    verse_count: number;
    is_visible: boolean;
    is_fiqh: boolean;
    chapters_json: any;
    actual_verse_count: string;
    created_at: string;
    author_id: string;
    author_name: string;
}

async function syncXassidas(): Promise<void> {
    console.log('🔄 Synchronisation avec l\'API en ligne:', EXTERNAL_API);

    try {
        const response = await axios.get<Xassida[]>(`${EXTERNAL_API}/xassidas`, {
            timeout: 30000,
            headers: { 'Accept': 'application/json' }
        });

        const xassidas = response.data;
        console.log(`📊 ${xassidas.length} xassidas récupérés\n`);

        let imported = 0;
        let errors = 0;

        for (const x of xassidas) {
            try {
                // S'assurer que l'auteur existe
                if (x.author_id && x.author_name) {
                    await pool.query(
                        `INSERT INTO authors (id, name, description) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (id) DO UPDATE SET 
               name = EXCLUDED.name, 
               description = EXCLUDED.description`,
                        [x.author_id.toString(), x.author_name, `Auteur de ${x.title}`]
                    );
                }

                // Importer/mettre à jour la xassida
                await pool.query(
                    `INSERT INTO xassidas 
           (id, title, description, arabic_name, categorie, verse_count, 
            actual_verse_count, is_visible, is_fiqh, author_id, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (id) DO UPDATE SET
             title = EXCLUDED.title,
             description = EXCLUDED.description,
             arabic_name = EXCLUDED.arabic_name,
             categorie = EXCLUDED.categorie,
             verse_count = EXCLUDED.verse_count,
             actual_verse_count = EXCLUDED.actual_verse_count,
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
                process.stdout.write(`\r✅ ${imported}/${xassidas.length} : ${x.title.substring(0, 30)}`);

            } catch (err) {
                errors++;
                console.error(`\n❌ Erreur pour ${x.title}:`, (err as Error).message);
            }
        }

        console.log(`\n\n📊 Résumé:`);
        console.log(`   ✅ Importés: ${imported}`);
        console.log(`   ❌ Erreurs: ${errors}`);
        console.log(`   📚 Total: ${xassidas.length}`);

        const result = await pool.query('SELECT COUNT(*) as total FROM xassidas');
        console.log(`\n📚 Base de données: ${result.rows[0].total} xassidas`);

    } catch (error) {
        console.error('❌ Erreur lors de la synchronisation:', (error as Error).message);
        if (axios.isAxiosError(error) && error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', JSON.stringify(error.response.data).substring(0, 200));
        }
    }

    process.exit(0);
}

syncXassidas();