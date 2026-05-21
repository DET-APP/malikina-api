-- Migration 028: Alias et surnoms courants des personnalités tidianes sénégalaises
-- Permet au chatbot de reconnaître les appellations populaires

INSERT INTO knowledge_chunks (source, title, language, content, metadata) VALUES
(
  'Connaissances Tidianes Sénégal',
  'Alias et surnoms des grandes figures tidianes sénégalaises',
  'fr',
  'Dans le contexte tidiane sénégalais, plusieurs personnalités sont désignées par des surnoms ou appellations populaires :

"SEYDINA CHEIKH", "CHEIKH TIDIANE", "CHEIKHOU TIDIANE", "LE CHEIKH" ou "CHEIKH" (tout court) : ces appellations désignent TOUJOURS le fondateur de la Tariqa Tijaniyya, Cheikh Ahmed Tijani Chérif (1737-1815), et non une autre personne. C''est lui le "Cheikh" par excellence dans la tradition tidianie. Né à Aïn Madhi (Algérie), il reçut la Tariqa directement du Prophète Muhammad ﷺ à l''état de veille en 1196 H à Boussemghoune, et s''installa à Fès (Maroc) où il mourut en 1230 H. Quand un disciple tidiane dit "le Cheikh a dit...", "Seydina Cheikh recommande...", "Cheikhou Tidiane a enseigné...", il parle TOUJOURS de Cheikh Ahmed Tijani Chérif.

"BAYE NIASSE" ou "BAYE" : désigne Cheikh Ibrahim Niasse (1900-1975), fondateur de la Fayda Tijaniyya, basé à Kaolack (Sénégal). Figure mondiale de la Tijaniyya avec des millions de disciples en Afrique et dans le monde.

"SEYDI" ou "SEYDI MALICK" : désigne Seydi El Hadji Malick Sy (1855-1922), fondateur de la branche tidianie de Tivaouane, premier grand représentant de la Tijaniyya au Sénégal.

"DABAKH" ou "SERIGNE DABAKH" : désigne Serigne Abdou Aziz Sy Dabakh (1904-1997), 4e Khalife de Tivaouane (1997), fils de Seydi El Hadji Malick Sy. Connu pour sa piété et sa sagesse. À ne pas confondre avec Serigne Abdou Al Amine Sy qui est son homonyme d''une génération différente.

"SERIGNE BABACAR" : désigne Serigne Babacar Sy (1er Khalife de Tivaouane), fils de Seydi El Hadji Malick Sy, père de Serigne Cheikh Al Maktoum.

"EL HADJI OMAR" ou "SEYDINA OMAR" : désigne El Hadji Oumar Tall (1794-1864), grand conquérant et propagateur de la Tijaniyya en Afrique de l''Ouest, auteur du Rimah.',
  '{"type":"reference","sujet":"alias_personnages","mots_cles":["seydina cheikh","cheikh tidiane","cheikhou tidiane","le cheikh","fondateur","baye niasse","seydi malick","dabakh","alias","surnoms","tivaouane"]}'
)
ON CONFLICT (source, title) DO UPDATE SET
  content = EXCLUDED.content,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();
