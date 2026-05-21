-- Migration 028: Alias et surnoms courants des personnalités tidianes sénégalaises
-- Permet au chatbot de reconnaître les appellations populaires

INSERT INTO knowledge_chunks (source, title, language, content, metadata) VALUES
(
  'Connaissances Tidianes Sénégal',
  'Alias et surnoms des grandes figures tidianes sénégalaises',
  'fr',
  'Dans le contexte tidiane sénégalais, plusieurs personnalités sont désignées par des surnoms ou appellations populaires :

"SEYDINA CHEIKH" ou "CHEIKH" (tout court) : désigne Serigne Cheikh Ahmed Tidiane Sy Al Maktoum (1925-2017), 5e Khalife Général des Tidianes de Tivaouane (2012-2017). Fils de Serigne Babacar Sy, petit-fils de Seydi El Hadji Malick Sy. Appelé "Al Maktoum" (le Pôle Caché). Surnommé "le marabout intellectuel du Sénégal". Ne pas confondre avec d''autres personnages portant "Cheikh" dans leur nom.

"BAYE NIASSE" ou "BAYE" : désigne Cheikh Ibrahim Niasse (1900-1975), fondateur de la Fayda Tijaniyya, basé à Kaolack (Sénégal). Figure mondiale de la Tijaniyya avec des millions de disciples en Afrique et dans le monde.

"SEYDI" ou "SEYDI MALICK" : désigne Seydi El Hadji Malick Sy (1855-1922), fondateur de la branche tidianie de Tivaouane, premier grand représentant de la Tijaniyya au Sénégal.

"DABAKH" ou "SERIGNE DABAKH" : désigne Serigne Abdou Aziz Sy Dabakh (1904-1997), 4e Khalife de Tivaouane (1997), fils de Seydi El Hadji Malick Sy. Connu pour sa piété et sa sagesse. À ne pas confondre avec Serigne Abdou Al Amine Sy qui est son homonyme d''une génération différente.

"SERIGNE BABACAR" : désigne Serigne Babacar Sy (1er Khalife de Tivaouane), fils de Seydi El Hadji Malick Sy, père de Serigne Cheikh Al Maktoum.

"EL HADJI OMAR" ou "SEYDINA OMAR" : désigne El Hadji Oumar Tall (1794-1864), grand conquérant et propagateur de la Tijaniyya en Afrique de l''Ouest, auteur du Rimah.',
  '{"type":"reference","sujet":"alias_personnages","mots_cles":["seydina cheikh","baye niasse","seydi malick","dabakh","alias","surnoms","tivaouane"]}'
)
ON CONFLICT (source, title) DO UPDATE SET
  content = EXCLUDED.content,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();
