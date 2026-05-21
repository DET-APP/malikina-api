-- Seed: grandes figures de la Tariqa Tijaniyya

INSERT INTO knowledge_chunks (source, title, language, content, metadata)
SELECT * FROM (VALUES
  (
    'Figures tidianes — Khalifes de Tivaouane',
    'Serigne Babacar Sy — Premier Khalife',
    'fr',
    'Serigne Babacar Sy (1882-1957) est le fils aîné de Seydi El Hadji Malick Sy et le premier Khalife Général des Tidianes de Tivaouane après le décès de son père en 1922. Il a consolidé l''œuvre de son père, maintenu l''unité de la communauté tidiane au Sénégal et assuré la continuité du Gamou de Tivaouane. Érudit accompli, il a poursuivi la tradition d''enseignement islamique initiée par Seydi Malick Sy.',
    '{"type":"biographie","famille":"Sy","role":"Khalife"}'::jsonb
  ),
  (
    'Figures tidianes — Khalifes de Tivaouane',
    'Serigne Abdou Aziz Sy Dabakh — Deuxième Khalife',
    'fr',
    'Serigne Abdou Aziz Sy Al Amine, dit Dabakh (1904-1997), est le fils de Seydi El Hadji Malick Sy et le deuxième Khalife Général des Tidianes de Tivaouane. Il a succédé à son frère Serigne Babacar Sy en 1957. Figure spirituelle majeure du Sénégal, il était reconnu pour sa profonde spiritualité, sa générosité et ses dons mystiques (karamaat). Il est l''auteur de nombreux xassidas et enseignements spirituels. Il a joué un rôle important dans le dialogue interreligieux et les relations avec l''État sénégalais. Son surnom "Dabakh" lui a été donné en référence à ses qualités spirituelles exceptionnelles. Il est décédé en 1997 et a été succédé par Serigne Mansour Sy.',
    '{"type":"biographie","famille":"Sy","role":"Khalife","pere":"Seydi El Hadji Malick Sy"}'::jsonb
  ),
  (
    'Figures tidianes — Khalifes de Tivaouane',
    'Serigne Mansour Sy — Troisième Khalife',
    'fr',
    'Serigne Mansour Sy (1938-2010) est le troisième Khalife Général des Tidianes de Tivaouane. Fils de Serigne Babacar Sy et petit-fils de Seydi El Hadji Malick Sy, il a succédé à Serigne Abdou Aziz Sy Dabakh en 1997. Il a poursuivi la tradition d''ouverture et de dialogue de ses prédécesseurs. Sous sa direction, la communauté tidiane de Tivaouane a continué de rayonner en Afrique de l''Ouest et dans la diaspora.',
    '{"type":"biographie","famille":"Sy","role":"Khalife"}'::jsonb
  ),
  (
    'Figures tidianes — Khalifes de Tivaouane',
    'Serigne Mbaye Sy Mansour — Khalife actuel',
    'fr',
    'Serigne Mbaye Sy Mansour est le Khalife Général actuel des Tidianes de Tivaouane. Fils de Serigne Mansour Sy et arrière-petit-fils de Seydi El Hadji Malick Sy, il dirige la communauté tidiane depuis 2010. Il incarne la continuité de la lignée spirituelle et intellectuelle des Sy de Tivaouane, et œuvre pour le renforcement des liens entre les tidianes du Sénégal et ceux de la diaspora mondiale.',
    '{"type":"biographie","famille":"Sy","role":"Khalife actuel"}'::jsonb
  ),
  (
    'Figures tidianes — Grands maîtres',
    'Cheikh Ibrahim Niasse — Faydatou Tijaniyya',
    'fr',
    'Cheikh Ibrahim Niasse (1900-1975), originaire de Kaolack (Sénégal), est l''une des figures les plus influentes de la Tariqa Tijaniyya au XXe siècle. Il est le fondateur du mouvement de la Faydatou Tijaniyya (le flot spirituel), une renaissance de la voie tijaniyya qui a touché des millions de disciples en Afrique subsaharienne, en Afrique du Nord et dans la diaspora. Il est l''auteur de nombreux ouvrages islamiques dont Kachif al-Ilbas. Sa zawiya de Kaolack (Sénégal) est un centre spirituel mondial. Le Magal de Kaolack lui rend hommage chaque année.',
    '{"type":"biographie","role":"Cheikh","mouvement":"Faydatou Tijaniyya"}'::jsonb
  ),
  (
    'Figures tidianes — Grands maîtres',
    'El Hadji Oumar Tall — Jihad et expansion tijaniyya',
    'fr',
    'El Hadji Oumar Tall (1797-1864) est un grand maître soufi tidiane originaire du Fouta Toro (Sénégal). Il reçut la wird tijaniyya directement des mains de Muhammad al-Ghali, disciple direct du Cheikh Ahmad Tijani. Grand érudit et chef militaire, il mena un jihad pour l''expansion de l''Islam en Afrique de l''Ouest et fonda l''Empire toucouleur. Son œuvre majeure Rimah Hizb al-Rahim traite des enseignements tidianes et constitue une référence fondamentale de la voie. Il est considéré comme l''un des plus grands propagateurs de la Tariqa Tijaniyya en Afrique de l''Ouest.',
    '{"type":"biographie","role":"Cheikh","pays":"Sénégal/Mali"}'::jsonb
  ),
  (
    'Figures tidianes — Famille Sy de Tivaouane',
    'Lignée spirituelle des Sy de Tivaouane',
    'fr',
    'La lignée spirituelle des Sy de Tivaouane est la principale famille khalifale de la Tariqa Tijaniyya au Sénégal. Elle descend de Seydi El Hadji Malick Sy (1855-1922). La succession des Khalifes Généraux est : 1) Serigne Babacar Sy (1922-1957), fils aîné. 2) Serigne Abdou Aziz Sy Dabakh (1957-1997), fils de Seydi Malick. 3) Serigne Mansour Sy (1997-2010), fils de Serigne Babacar. 4) Serigne Mbaye Sy Mansour (2010-présent), fils de Serigne Mansour. Chaque khalife a perpétué le Gamou de Tivaouane et les enseignements tidianes.',
    '{"type":"genealogie","famille":"Sy","lieu":"Tivaouane"}'::jsonb
  )
) AS v(source, title, language, content, metadata)
WHERE NOT EXISTS (
  SELECT 1 FROM knowledge_chunks WHERE knowledge_chunks.source = v.source AND knowledge_chunks.title = v.title
);
