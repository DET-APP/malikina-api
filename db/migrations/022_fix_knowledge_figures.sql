-- Correction et enrichissement des biographies des figures tidianes de Tivaouane

-- Supprimer les chunks incorrects de la migration 021
DELETE FROM knowledge_chunks WHERE source = 'Figures tidianes — Khalifes de Tivaouane';
DELETE FROM knowledge_chunks WHERE source = 'Figures tidianes — Famille Sy de Tivaouane';

-- Réinsérer avec données correctes
INSERT INTO knowledge_chunks (source, title, language, content, metadata)
SELECT * FROM (VALUES
  (
    'Khalifes de Tivaouane — Famille Sy',
    'Serigne Abdoul Aziz Sy Dabakh — 3e Khalife',
    'fr',
    'Serigne Abdoul Aziz Sy Dabakh (28 juin 1904 – 14 septembre 1997) est le fils direct de Seydi El Hadji Malick Sy et de Sokhna Safiyatou Niang. Il est le 3e Khalife Général des Tidianes de Tivaouane. La succession avant lui : 1er Khalife : Serigne Babacar Sy (frère aîné, 1922–1957) ; 2e Khalife : Serigne Mansour Sy Balkhawmi (frère, seulement 4 jours en mars 1957). Dabakh prend le khalifat en 1957 et le dirige pendant 40 ans jusqu''à son décès en 1997 — la plus longue période de khalifat de Tivaouane. Son surnom "Dabakh" vient du wolof et évoque sa générosité légendaire envers les nécessiteux. Reconnu pour sa profonde spiritualité, ses karamaat (dons mystiques), et sa maîtrise de l''arabe classique. Il a représenté le Sénégal au congrès islamique de La Mecque en 1965 et a effectué des voyages diplomatiques au Maroc, Arabie saoudite, USA et France. Auteur de nombreux xassidas et enseignements spirituels. Succédé par Serigne Mansour Sy "Borom Daara Ji".',
    '{"type":"biographie","famille":"Sy","role":"3e Khalife","pere":"Seydi El Hadji Malick Sy","khalifat":"1957-1997"}'::jsonb
  ),
  (
    'Khalifes de Tivaouane — Famille Sy',
    'Serigne Abdoul Aziz Sy Al Amine — 6e Khalife',
    'fr',
    'Serigne Abdoul Aziz Sy Al Amine (né en 1927/1928 – décédé le 22-23 septembre 2017) est le petit-fils de Seydi El Hadji Malick Sy. Son père est Serigne Babacar Sy (1er Khalife, fils aîné de Maodo) et sa mère est Sokhna Astou Kane. Il est donc le neveu de Serigne Abdoul Aziz Sy Dabakh (son oncle paternel). Il est le 6e Khalife Général des Tidianes de Tivaouane, désigné le 15 mars 2017 après le décès de son frère Serigne Cheikh Ahmed Tidiane Sy Al Maktoum (5e Khalife). Son khalifat dure environ 6 mois jusqu''à son décès en septembre 2017. Surnom "Al Amine" (l''homme de confiance, le loyal) — même surnom que le Prophète Muhammad avant sa mission. Rôles marquants : porte-parole du Khalife général pendant des décennies, fondateur du COSKAS en 1968 (organisation et sécurité du Gamou), fondateur de la Zawiya El Hadji Malick Sy de New York, initiateur des Hadaratoul Jumma. Reconnu comme médiateur et unificateur au sein de la famille Sy et dans la société sénégalaise. Succédé par Serigne Babacar Sy Mansour (7e Khalife, Khalife actuel).',
    '{"type":"biographie","famille":"Sy","role":"6e Khalife","pere":"Serigne Babacar Sy","grand_pere":"Seydi El Hadji Malick Sy","khalifat":"mars-sept 2017"}'::jsonb
  ),
  (
    'Khalifes de Tivaouane — Famille Sy',
    'Serigne Babacar Sy — 1er Khalife',
    'fr',
    'Serigne Babacar Sy (dit Seydi Ababacar Sy) est le fils aîné de Seydi El Hadji Malick Sy et le 1er Khalife Général des Tidianes de Tivaouane. Il succède à son père au décès de ce dernier le 27 juin 1922 et dirige la communauté jusqu''à son décès le 25 mars 1957. Sous son khalifat, il consolide l''œuvre de son père et maintient l''unité de la communauté tidiane au Sénégal. Il est le père de Serigne Abdoul Aziz Sy Al Amine (6e Khalife) et de Serigne Cheikh Ahmed Tidiane Sy Al Maktoum (5e Khalife).',
    '{"type":"biographie","famille":"Sy","role":"1er Khalife","khalifat":"1922-1957"}'::jsonb
  ),
  (
    'Khalifes de Tivaouane — Famille Sy',
    'Succession complète des Khalifes de Tivaouane',
    'fr',
    'La succession des Khalifes Généraux des Tidianes de Tivaouane depuis Seydi El Hadji Malick Sy : 1er Khalife : Serigne Babacar Sy (1922–1957), fils aîné de Maodo. 2e Khalife : Serigne Mansour Sy Balkhawmi (mars 1957, seulement 4 jours), fils de Maodo, grand poète et érudit. 3e Khalife : Serigne Abdoul Aziz Sy Dabakh (1957–1997), fils de Maodo, 40 ans de khalifat. 4e Khalife : Serigne Mansour Sy "Borom Daara Ji" (1997–2012), fils de Serigne Babacar Sy, petit-fils de Maodo. 5e Khalife : Serigne Cheikh Ahmed Tidiane Sy Al Maktoum (2012–2017), fils de Serigne Babacar Sy, petit-fils de Maodo. 6e Khalife : Serigne Abdoul Aziz Sy Al Amine (mars–septembre 2017), fils de Serigne Babacar Sy, petit-fils de Maodo. 7e Khalife : Serigne Babacar Sy Mansour (depuis septembre 2017), Khalife actuel, fils de Serigne Mansour Sy Borom Daara Ji, arrière-petit-fils de Maodo.',
    '{"type":"genealogie","famille":"Sy","lieu":"Tivaouane"}'::jsonb
  ),
  (
    'Figures tidianes — Grands maîtres',
    'Cheikh Ibrahim Niasse — Faydatou Tijaniyya',
    'fr',
    'Cheikh Ibrahim Niasse (1900-1975), originaire de Kaolack (Sénégal), est l''une des figures les plus influentes de la Tariqa Tijaniyya au XXe siècle. Il est le fondateur du mouvement de la Faydatou Tijaniyya (le flot spirituel), une renaissance de la voie tijaniyya qui a touché des millions de disciples en Afrique subsaharienne, en Afrique du Nord et dans la diaspora. Il est l''auteur de nombreux ouvrages islamiques dont Kachif al-Ilbas. Sa zawiya de Kaolack est un centre spirituel mondial. Le Magal de Kaolack lui rend hommage chaque année.',
    '{"type":"biographie","role":"Cheikh","mouvement":"Faydatou Tijaniyya"}'::jsonb
  ),
  (
    'Figures tidianes — Grands maîtres',
    'El Hadji Oumar Tall — Jihad et expansion tijaniyya',
    'fr',
    'El Hadji Oumar Tall (1797-1864) est un grand maître soufi tidiane originaire du Fouta Toro (Sénégal). Il reçut la wird tijaniyya directement des mains de Muhammad al-Ghali, disciple direct du Cheikh Ahmad Tijani. Grand érudit et chef militaire, il mena un jihad pour l''expansion de l''Islam en Afrique de l''Ouest et fonda l''Empire toucouleur. Son œuvre majeure Rimah Hizb al-Rahim traite des enseignements tidianes et constitue une référence fondamentale de la voie.',
    '{"type":"biographie","role":"Cheikh","pays":"Sénégal/Mali"}'::jsonb
  )
) AS v(source, title, language, content, metadata)
WHERE NOT EXISTS (
  SELECT 1 FROM knowledge_chunks WHERE knowledge_chunks.source = v.source AND knowledge_chunks.title = v.title
);
