-- Migration 024: Biographie complète et vérifiée de Serigne Cheikh Ahmed Tidiane Sy Al Maktoum
-- Sources: Wikipedia fr, lesoleil.sn, zawiya.sn, dakaractu.com, jeune afrique, rts.sn (26 sources)

DELETE FROM knowledge_chunks WHERE source = 'Khalifes de Tivaouane' AND title = 'Serigne Cheikh Ahmed Tidiane Sy Al Maktoum — 5e Khalife';

INSERT INTO knowledge_chunks (source, title, language, content, metadata) VALUES
(
  'Khalifes de Tivaouane',
  'Serigne Cheikh Ahmed Tidiane Sy Al Maktoum — 5e Khalife',
  'fr',
  'Serigne Cheikh Ahmed Tidiane Sy Al Maktoum (29 décembre 1925, Saint-Louis – 15 mars 2017, Dakar) est le 5e Khalife Général des Tidianes de Tivaouane (2012-2017). Fils de Serigne Babacar Sy (1er Khalife) et de Sokhna Astou Kane, descendante de Maba Diakhou Ba. Petit-fils d''El Hadji Malick Sy. Son surnom "Al Maktoum" (l''Écrit, le Caché, le Prédestiné) a une dimension mystique : dans les cercles soufis, il est appelé Khoutboul Maktoum (le Pôle Caché). Il partage le prénom du fondateur Ahmad Tijani — un "double privilège" que les talibes soulignent.

FORMATION ET PRÉCOCITÉ : Il boucle les cycles inférieur et moyen des études islamiques à 14 ans. À 16 ans, il publie son premier ouvrage "Les Vices des marabouts", critique courageuse des dérives religieuses. Il séjourne plusieurs années en France à la trentaine.

RÉVOLUTIONNAIRE DES MŒURS : Premier de sa famille à porter des vêtements occidentaux, il installe le téléphone pour le Khalife, achète une automobile, encourage les apparitions publiques des guides. Surnommé "le marabout intellectuel du Sénégal".

ŒUVRES : Poème "Fa Ilayka Yabna Muhammaddine Nâdânî" (Nuniyya composée en prison en 1963, chef-d''œuvre poétique en arabe) ; "L''Inconnu de la nation sénégalaise : El-Hadji Malick Sy" (biographie de son grand-père) ; "L''État de droit" (essai) ; élégie pour Aldo Moro (1978) ; khassidas sur le domaine de Boulel et en hommage à Omar Saidou Tall. Ses discours du Gamou (1998-2011) sont légendaires — véritables leçons d''histoire, de sociologie et de philosophie.

ENGAGEMENT POLITIQUE : En 1959, il fonde le Parti de la Solidarité Sénégalaise (PSS) et se présente contre Senghor aux législatives. Emprisonné en 1959 après des émeutes à Tivaouane. Nommé Ambassadeur du Sénégal en Égypte et Syrie (1960-1962), il noue des relations avec Nasser. Emprisonné une seconde fois en 1962. C''est lui qui présente Senghor à son père Serigne Babacar Sy, déterminant le soutien des confréries. Il aurait conseillé à Senghor de quitter le pouvoir en 1980.

EMPIRE INDUSTRIEL : Domaine agricole de Boulel (Kaffrine), huileries SEIB (futures SONACOS), conserverie de tomates, actionnaire majoritaire de la SOCOCIM (cimenterie de Rufisque). Préside le CA de la BICIS (2001-2002). Seul Khalife de l''histoire de Tivaouane à avoir bâti un empire industriel.

CITATIONS : "La religion ne doit pas rendre neutre son sujet aux travaux de réforme mondiale." — "Les systèmes financiers, politiques et religieux sont tous mal fichus. On ne peut pas mondialiser la bêtise !" (Gamou 2003) — "L''amour sans action n''a point d''intérêt."

RETRAITE MYSTIQUE : Depuis le Gamou 2011, il ne fait plus d''apparition publique — même après sa désignation comme Khalife en 2012. Son fils Serigne Moustapha Sy conduit les cérémonies. Ce retrait est interprété comme cohérent avec son surnom Al Maktoum (le Pôle Caché). Il est inhumé discrètement à Tivaouane, au quartier Ndiandakhoum, selon sa propre volonté. En mars 2026, un colloque international se tient pour son centenaire au CICAD (Diamniadio).',
  '{"type":"biographie","famille":"Sy","role":"5e Khalife","naissance":"1925-12-29","deces":"2017-03-15","khalifat":"2012-2017","pere":"Serigne Babacar Sy","grand_pere":"El Hadji Malick Sy"}'
);
