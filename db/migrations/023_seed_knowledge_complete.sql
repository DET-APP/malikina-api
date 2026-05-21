-- Migration 023: Base de connaissances complète et vérifiée
-- Sources: Wikipedia fr/en, zawiya.sn, coskas.net, tidjaniya.com, seneweb.com, lesoleil.sn, ssmasenegal.com
-- Remplace les chunks des migrations 019, 020, 021, 022 avec des données corrigées et enrichies

-- Nettoyer toutes les anciennes entrées
DELETE FROM knowledge_chunks WHERE source IN (
  'Jawahirul Ma''ani',
  'Munyat al-Murid',
  'Fakihat al-Tulab',
  'Seydi El Hadji Malick Sy — Biographie et œuvres',
  'Doctrine et pratiques tidianes',
  'Khalifes de Tivaouane — Famille Sy',
  'Figures tidianes — Grands maîtres',
  'Figures tidianes — Khalifes de Tivaouane',
  'Figures tidianes — Famille Sy de Tivaouane'
);

-- ═══════════════════════════════════════════════════════════════
-- 1. FONDATEUR : CHEIKH AHMAD TIJANI
-- ═══════════════════════════════════════════════════════════════

INSERT INTO knowledge_chunks (source, title, language, content, metadata) VALUES
(
  'Cheikh Ahmad Tijani — Fondateur',
  'Biographie de Cheikh Ahmad Tijani',
  'fr',
  'Cheikh Ahmad ibn Muhammad al-Tijani (1737-1815) est le fondateur de la Tariqa Tijaniyya. Né à Aïn Madhi (Algérie), il mémorise le Coran à 7 ans et enseigne la jurisprudence islamique dès 15 ans. Il étudie à l''Université Al-Qaraouiyine de Fès et s''affilie successivement à plusieurs confréries soufies (Ouazzaniya, Tawwachiya, Qadiriyya, Nassriyya, Siddiqiyya). En 1781, lors d''une retraite spirituelle à Boussemghoun (Algérie), il rapporte avoir reçu une vision éveillée du Prophète Muhammad qui lui ordonne de fonder un nouvel ordre soufi indépendant. En 1798, il s''installe définitivement à Fès (Maroc) où sa zawiya devient le centre de la confrérie. Il décède le 22 septembre 1815 à Fès et y est enterré. Sa zawiya de Fès est encore aujourd''hui un lieu de pèlerinage majeur.',
  '{"type":"biographie","role":"fondateur","naissance":"1737","deces":"1815","lieu":"Algérie/Maroc"}'
),
(
  'Cheikh Ahmad Tijani — Fondateur',
  'Doctrine fondamentale de la Tijaniyya',
  'fr',
  'La doctrine de la Tariqa Tijaniyya repose sur plusieurs principes fondamentaux : 1) La voie est exclusive — le disciple doit quitter tout autre ordre soufi en rejoignant la Tijaniyya. 2) La transmission directe — Cheikh Tijani affirme avoir reçu la voie directement du Prophète Muhammad en état de veille (yaqazatan), non en rêve, sans intermédiaire humain vivant. 3) La Khatmiyya — Cheikh Tijani est reconnu dans la doctrine comme le Khatm al-Awliya (Sceau des Saints), de même que Muhammad est le Khatm al-Anbiya. 4) La supériorité de la voie — "chaque voie entre dans la nôtre" selon la doctrine. 5) Les trois pratiques obligatoires : le Wird (deux fois/jour), la Wazifa (une fois/jour), et la Haylala du vendredi. Cheikh Tijani était théologien asharite et juriste malikite.',
  '{"type":"doctrine","confrérie":"Tijaniyya"}'
);

-- ═══════════════════════════════════════════════════════════════
-- 2. LIVRES FONDAMENTAUX
-- ═══════════════════════════════════════════════════════════════

INSERT INTO knowledge_chunks (source, title, language, content, metadata) VALUES
(
  'Jawahir al-Maani — Livre fondamental',
  'Présentation du Jawahir al-Maani',
  'fr',
  'Le Jawahir al-Ma''ani wa bulugh al-amani fi fayd Sidi Abi-l-Abbas al-Tijani ("Les Perles des Significations et la réalisation des vœux dans le flux de Sidi Abou-l-Abbas al-Tijani") est le texte de référence absolue de la Tijaniyya. Il a été compilé et rédigé par Sidi Ali Harazem Berrada (décédé en 1797), premier disciple et secrétaire personnel du fondateur, sur ordre et sous la dictée directe de Cheikh Ahmad Tijani. L''ouvrage couvre en 6 parties et 16 chapitres : la vie et le parcours spirituel du Cheikh, la doctrine complète de la Tariqa (règles, conditions, pratiques), ses connaissances du Coran et de la Sunna, ses karamaat (miracles), et une compilation de ses dits, fatawa et correspondances. C''est la source doctrinale primaire de la Tijaniyya, traduite en français par le Professeur Rawane Mbaye (Sénégal).',
  '{"type":"livre","auteur":"Ali Harazem Berrada","importance":"référence absolue"}'
),
(
  'Fakihat al-Tulab — Livre de Seydi Malick',
  'Présentation de Fakihat al-Tulab',
  'fr',
  'Fakihat al-Tulab (فاكهة الطلاب — "Le Fruit des Apprenants") est une œuvre doctrinale d''El Hadji Malick Sy (1855-1922), le principal propagateur de la Tijaniyya au Sénégal. Cet ouvrage didactique expose les principes fondamentaux de la Tariqa Tijaniyya destinés aux disciples : les règles du Wird (pratiques quotidiennes), la discipline du murid (l''aspirant), et les réalités spirituelles sous-jacentes à la voie. Dans sa conclusion ("Khâtimat fi Bayâni Ikhtilâfi awliyâ''i l-lâhi fi t-tarâ''iq"), El Hadji Malick Sy adopte une vision ouverte et tolérante : les différences entre les voies soufies doivent être perçues comme des "différences de goût" et non comme des sources de conflit. Il appelle à reconnaître les mérites de chaque homme de Dieu.',
  '{"type":"livre","auteur":"El Hadji Malick Sy","langue_originale":"arabe"}'
),
(
  'Munyat al-Murid — Texte éducatif',
  'Présentation du Munyat al-Murid',
  'fr',
  'Le Munyat al-Murid (منية المريد — "Le Vœu du Disciple") est un poème versifié en arabe composé par un maître mauritanien de la Tijaniyya. Il traite des règles d''éthique (adab) du disciple et du maître dans la voie tijaniyya, des conditions d''initiation et des pratiques spirituelles. Le principal commentaire de cet ouvrage, intitulé "Bughyat al-Mustafid" (L''Aspiration du bénéficiaire), a été rédigé par Shaykh Muhammad al-Arabi ibn Muhammad al-Saih al-Umari de Meknès (1814-1892). Ce texte est encore étudié aujourd''hui par les étudiants dans les zawiya du Maghreb. À ne pas confondre avec l''œuvre du célèbre commentateur Cheikh Ahmad Skirej, qui est l''auteur de nombreux commentaires sur des textes tijaniyya (dont le Kashf al-Hijab) mais n''est pas l''auteur original du Munyat al-Murid.',
  '{"type":"livre","genre":"poésie_doctrinale"}'
),
(
  'Rimah — El Hadji Oumar Tall',
  'Le Rimah d''El Hadji Oumar Tall',
  'fr',
  'Al-Rimah hizb al-Rahim ''ala nuhur hizb al-Rajim ("Les Lances du parti du Miséricordieux contre les gorges du parti du Maudit") est l''œuvre majeure d''El Hadji Oumar Tall (1797-1864). C''est un traité théologique et mystique sur la Tijaniyya : sa doctrine, ses pratiques et leur justification scripturaire par le Coran et la Sunna. C''est la référence doctrinale la plus influente de la Tijaniyya en Afrique de l''Ouest après le Jawahir al-Ma''ani. El Hadji Oumar Tall fut le premier grand vecteur de la Tijaniyya en Afrique sub-saharienne, ayant reçu à La Mecque en 1828 le titre de Khalife de la Tijaniyya pour l''Afrique sub-saharienne des mains de Muhammad al-Ghali, disciple direct du fondateur.',
  '{"type":"livre","auteur":"El Hadji Oumar Tall"}'
);

-- ═══════════════════════════════════════════════════════════════
-- 3. PRATIQUES : WIRD, WAZIFA, SALAT AL-FATIHI, JAWHARATUL KAMAL
-- ═══════════════════════════════════════════════════════════════

INSERT INTO knowledge_chunks (source, title, language, content, metadata) VALUES
(
  'Pratiques tidianes — Wird',
  'Le Wird Tidiaan — Composition et règles',
  'fr',
  'Le Wird (aussi appelé Lazim — l''obligatoire) est la pratique fondamentale de la Tijaniyya, transmise par le Prophète à Cheikh Tijani. Il se récite deux fois par jour. Composition exacte : 1) Istighfar : "Astaghfiru-llaha-l-''Adhim alladhi la ilaha illa Huwa-l-Hayyu-l-Qayyum" — 100 fois. 2) Salat al-Fatihi — 100 fois. 3) Haylala : "La ilaha illa-llah" — 100 fois. Horaires : matin après Fajr (jusqu''à environ 3h après le lever du soleil) ; soir après ''Asr (jusqu''à environ 4h après le coucher du soleil, ne peut pas être récité après Isha). Règles : être en état de wudu, assis comme en prière, orienté vers la Qibla, voix basse, sans interruption inutile. En cas d''oubli le matin, on peut rattraper avant le coucher du soleil ; si oublié le soir, il n''est pas rattrapable.',
  '{"type":"pratique","obligatoire":true,"frequence":"2x/jour"}'
),
(
  'Pratiques tidianes — Wazifa',
  'La Wazifa — Composition et différence avec le Wird',
  'fr',
  'La Wazifa est la deuxième pratique obligatoire de la Tijaniyya, distincte du Wird. Composition : 1) Istighfar — 30 fois. 2) Salat al-Fatihi — 50 fois. 3) Chahada "La ilaha illa-llah" — 100 fois. 4) Jawharatul Kamal — 12 fois. Fréquence : une fois par jour (soit matin soit soir). Caractéristiques : pratiquée de préférence en collectif, à voix haute, en rangs ordonnés autour d''un tissu blanc, purification absolue requise. Différences avec le Wird : le Wird est individuel (voix basse, 100 Istighfar, 100 Salat Fatihi, sans Jawharatul Kamal) ; la Wazifa est collective (voix haute, 30 Istighfar, 50 Salat Fatihi, avec 12 Jawharatul Kamal). Selon le Professeur Abdoul Aziz Kébé, la composition de la Wazifa fut révélée graduellement à Cheikh Tijani.',
  '{"type":"pratique","obligatoire":true,"frequence":"1x/jour"}'
),
(
  'Pratiques tidianes — Salat al-Fatihi',
  'La Salat al-Fatihi — Texte, traduction et vertus',
  'fr',
  'La Salat al-Fatihi (صلاة الفاتح) est la prière centrale de la Tariqa Tijaniyya. Texte arabe : اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ وَالْخَاتِمِ لِمَا سَبَقَ، نَاصِرِ الْحَقِّ بِالْحَقِّ، وَالْهَادِي إِلَى صِرَاطِكَ الْمُسْتَقِيمِ، وَعَلَى آلِهِ حَقَّ قَدْرِهِ وَمِقْدَارِهِ الْعَظِيمِ. Traduction : "Ô Allah, envoie Tes bénédictions sur notre Seigneur Muhammad, l''Ouvreur de ce qui était fermé, le Sceau de ce qui précédait, le Défenseur du Vrai par le Vrai, le Guide vers Ta voie droite, et sur sa famille, selon sa haute valeur et son immense rang." Selon la doctrine tijaniyya, une seule récitation égale 6 000 fois toutes les évocations, glorifications et supplications accomplies dans l''univers. Elle ne peut être remplacée par aucune autre salat dans le Wird ou la Wazifa.',
  '{"type":"pratique","categorie":"salawat"}'
),
(
  'Pratiques tidianes — Jawharatul Kamal',
  'La Jawharatul Kamal — Joyau de la perfection',
  'fr',
  'La Jawharatul Kamal (جوهرة الكمال — "La Perle de la Perfection") est une invocation mystique de la Tariqa Tijaniyya, transmise directement par le Prophète Muhammad à Cheikh Ahmad Tijani lors d''une vision éveillée. Elle est récitée 12 fois dans la Wazifa quotidienne. Conditions strictes de récitation : purité corporelle, vestimentaire et du lieu obligatoires ; ablutions complètes (wudu) ; position assise pendant toute la récitation ; ne peut pas être récitée sur un animal ou en mouvement (sauf force majeure) ; en collectif, les participants s''assoient en cercle autour d''un tissu blanc. Si les conditions ne peuvent être respectées (voyage), on remplace par 20 Salat al-Fatihi. Selon la doctrine tijaniyya, une seule récitation équivaut à la glorification de l''univers entier récitée trois fois.',
  '{"type":"pratique","categorie":"invocation_mystique","conditions_strictes":true}'
),
(
  'Pratiques tidianes — Haylala du vendredi',
  'La Haylala du vendredi (Hadra)',
  'fr',
  'La Haylala du vendredi (appelée aussi Hadra ou ''Asru) est la troisième pratique obligatoire de la Tijaniyya, pratiquée exclusivement le vendredi. Elle consiste en la récitation collective de "La ilaha illa-llah" entre 1000 et 1600 fois selon les règles, suivie de "Sayyiduna Muhammadun Rasulu-llah". Règles strictes : pratiquée uniquement le vendredi entre la prière de ''Asr et celle de Maghrib (idéalement juste avant l''adhan du Maghrib) ; purification requise ; participants assis en cercle autour d''un tissu blanc ; récitation à voix haute et en rythme. Non rattrapable : si la Haylala du vendredi est manquée, elle ne peut être compensée ultérieurement, contrairement au Wird.',
  '{"type":"pratique","obligatoire":true,"frequence":"vendredi uniquement"}'
),
(
  'Pratiques tidianes — Muqaddam',
  'Le Muqaddam — Rôle et conditions',
  'fr',
  'Le Muqaddam est le représentant autorisé de la Tijaniyya investi du pouvoir de conférer l''initiation (le Wird) aux nouveaux disciples. Rôles : admettre les nouveaux disciples, transmettre le Wird avec ses instructions, éduquer et guider les talibés dans la voie. Conditions pour devenir Muqaddam : solide pratique islamique vécue, connaissance du Coran et de la Sunna, piété reconnue, approbation accordée par le guide (non sollicitée par le candidat lui-même). Deux types d''autorisation (ijaza) : ijaza simple (nombre limité de disciples) et ijaza ithlakh absolue (nombre illimité de disciples, peut ordonner d''autres muqaddams). La Silsila (chaîne de transmission) remonte de muqaddam en muqaddam jusqu''au Cheikh Ahmad Tijani, puis jusqu''au Prophète. Au Sénégal, la chaîne principale passe par El Hadji Malick Sy (Tivaouane) ou Ibrahim Niasse (Médina Baye).',
  '{"type":"doctrine","categorie":"organisation_confrérie"}'
);

-- ═══════════════════════════════════════════════════════════════
-- 4. SEYDI EL HADJI MALICK SY
-- ═══════════════════════════════════════════════════════════════

INSERT INTO knowledge_chunks (source, title, language, content, metadata) VALUES
(
  'Seydi El Hadji Malick Sy',
  'Biographie de Seydi El Hadji Malick Sy',
  'fr',
  'Seydi El Hadji Malick Sy (vers 1855 – 27 juin 1922) est le principal propagateur de la Tariqa Tijaniyya au Sénégal et en Afrique de l''Ouest. Né à Gaé (Gaaya), près de Dagana (Sénégal), fils de Sidy Ousmane Sy et de Sokhna Fatoumata Wade Wele. Il mémorise le Coran dans son village natal et consacre 25 ans à la quête du savoir à travers le Sénégal, le Fouta et la Mauritanie. En 1888, il effectue son premier pèlerinage à La Mecque et revient avec le titre de Khalife de la Tijaniyya pour le Sénégal. Il s''installe définitivement à Tivaouane en 1902, qui devient le principal centre tidiaan du Sénégal. Il y organise le premier Gamou public le 12 Rabioul Awal 1320 H (1902). Grand érudit maîtrisant l''arabe, les sciences islamiques classiques, les mathématiques et l''astronomie. Il décède le 27 juin 1922 à Tivaouane.',
  '{"type":"biographie","role":"propagateur_tijaniyya_senegal","naissance":"~1855","deces":"1922-06-27"}'
),
(
  'Seydi El Hadji Malick Sy',
  'Œuvres de Seydi El Hadji Malick Sy',
  'fr',
  'Seydi El Hadji Malick Sy est l''auteur de nombreuses œuvres en arabe et en wolof. Ses principales œuvres : 1) Khilaçu ez-Zahab (خلاص الذهب — "L''Or Décanté") — vaste poème biographique sur le Prophète Muhammad depuis sa création jusqu''à sa mission, considéré comme son chef-d''œuvre, récité lors du Gamou. 2) Fakihatoul Toullâb — doctrine et pratiques de la Tijaniyya. 3) Ifhâm al-Munkirou Jaani — défense de la Tijaniyya contre ses critiques wahhabites. 4) Hourôufou Salatil Fatihi — poème construit à partir des lettres de la Salat al-Fatihi. 5) Wassîlatoul Mounâ / Taïssir — glorification des 99 noms divins. 6) Zajr Ul Qulûb — sermon sur le détachement du monde. 7) Kifayat ar-Raghibin — jurisprudence et spiritualité. 8) Adâboul Masdjid — étiquette de la mosquée. 9) Diwan — recueil poétique sur le Prophète, Ahmad Tijani et El Hadji Oumar Tall.',
  '{"type":"oeuvres","auteur":"El Hadji Malick Sy"}'
),
(
  'Seydi El Hadji Malick Sy',
  'Rôle historique de Seydi Malick Sy',
  'fr',
  'Seydi El Hadji Malick Sy a joué un rôle historique majeur dans l''islamisation du Sénégal. Il prônait la tolérance, le savoir et la coexistence avec l''autorité coloniale française — non par soumission, mais pour préserver les communautés musulmanes et permettre leur développement spirituel. Il est le premier à organiser les "dahiras" (associations de disciples tidianes) à grande échelle. Il a fondé des daara (écoles coraniques) à travers tout le Sénégal et formé des générations d''érudits. L''organisation du premier Gamou public en 1902 à Tivaouane est l''une de ses innovations majeures : il "sort la célébration du Mawlid des maisons privées pour l''amener dans l''espace public", touchant ainsi les masses. Il est considéré comme le plus grand érudit de la Tijaniyya en Afrique noire.',
  '{"type":"histoire","impact":"islamisation_senegal"}'
);

-- ═══════════════════════════════════════════════════════════════
-- 5. KHALIFES DE TIVAOUANE
-- ═══════════════════════════════════════════════════════════════

INSERT INTO knowledge_chunks (source, title, language, content, metadata) VALUES
(
  'Khalifes de Tivaouane',
  'Succession complète des 7 Khalifes de Tivaouane',
  'fr',
  'La succession des Khalifes Généraux des Tidianes de Tivaouane depuis El Hadji Malick Sy (décédé le 27 juin 1922) : 1er Khalife : Serigne Babacar Sy (1922–1957), fils aîné de Maodo, décédé le 25 mars 1957. 2e Khalife : Serigne Mansour Sy Balkhawmi (mars 1957, seulement 4 jours), fils de Maodo, grand poète et érudit, décédé le 29 mars 1957. 3e Khalife : Serigne Abdoul Aziz Sy Dabakh (1957–1997), fils de Maodo, 40 ans de khalifat. 4e Khalife : Serigne Mansour Sy Borom Daara Ji (1997–2012), fils de Serigne Babacar Sy, petit-fils de Maodo. 5e Khalife : Serigne Cheikh Ahmed Tidiane Sy Al Maktoum (2012–2017), fils de Serigne Babacar Sy, petit-fils de Maodo. 6e Khalife : Serigne Abdoul Aziz Sy Al Amine (mars–septembre 2017), fils de Serigne Babacar Sy, petit-fils de Maodo. 7e Khalife : Serigne Babacar Sy Mansour (depuis septembre 2017), Khalife actuel, fils de Serigne Mansour Sy Borom Daara Ji.',
  '{"type":"genealogie","famille":"Sy","lieu":"Tivaouane"}'
),
(
  'Khalifes de Tivaouane',
  'Serigne Babacar Sy — 1er Khalife',
  'fr',
  'Serigne Babacar Sy (né en 1885 à Saint-Louis – décédé le 25 mars 1957 à Tivaouane) est le fils aîné d''El Hadji Malick Sy et de Sokhna Rokhaya N''Diaye. Il est le 1er Khalife Général des Tidianes du Sénégal (1922-1957). Érudit raffiné, poète de talent, spécialiste du Tajwid (science de la récitation coranique) et exégète du Coran. Il est le père des dahiras tidianes : c''est sous son khalifat que commença la "tidjanisation" par les associations de disciples. En 1930, il institue la Ziarra générale annuelle de Tivaouane. Ses fils Serigne Cheikh Ahmed Tidiane Sy Al Maktoum (5e Khalife) et Serigne Abdoul Aziz Sy Al Amine (6e Khalife) ont tous deux accédé au khalifat.',
  '{"type":"biographie","famille":"Sy","role":"1er Khalife","pere":"El Hadji Malick Sy","khalifat":"1922-1957"}'
),
(
  'Khalifes de Tivaouane',
  'Serigne Abdoul Aziz Sy Dabakh — 3e Khalife',
  'fr',
  'Serigne Abdoul Aziz Sy Dabakh (né le 28 juin 1904 à Tivaouane – décédé le 14 septembre 1997) est le fils d''El Hadji Malick Sy et de Sokhna Safiétou Niang. Il est le 3e Khalife Général des Tidianes (1957-1997) — le plus long khalifat de Tivaouane avec 40 ans. Son surnom "Dabakh" vient du wolof et évoque sa générosité légendaire ("le tanneur des cœurs"). Il prend le khalifat en mars 1957, après les décès rapprochés de ses deux frères aînés en 4 jours. Formation : éducation par son père et ses grands frères, séjour à Saint-Louis de 1930 à 1937, pèlerinage à La Mecque en 1947. Réalisations : construction de la Grande Mosquée de Tivaouane, voyages diplomatiques au Maroc, Arabie Saoudite, USA et France, représentation du Sénégal au congrès islamique de La Mecque en 1965 où il se distingue par sa maîtrise de l''arabe classique, engagement pour l''unité inter-confrérique et le dialogue islamo-chrétien. Il aimait dire : "La diversité des minarets n''altère pas l''unité du message d''Allah."',
  '{"type":"biographie","famille":"Sy","role":"3e Khalife","pere":"El Hadji Malick Sy","naissance":"1904","deces":"1997","khalifat":"1957-1997"}'
),
(
  'Khalifes de Tivaouane',
  'Serigne Mansour Sy Borom Daara Ji — 4e Khalife',
  'fr',
  'Serigne Mansour Sy Borom Daara Ji (né le 15 août 1925 à Tivaouane – décédé le 9 décembre 2012 à Neuilly-sur-Seine, France) est le 4e Khalife Général des Tidianes (1997-2012). Petit-fils d''El Hadji Malick Sy. Son père est Serigne Babacar Sy (1er Khalife) et sa mère est Sokhna Aïssatou Seck. Son surnom "Borom Daara Ji" (Le Maître des Écoles en wolof) reflète son impact considérable sur l''éducation islamique : il a créé et implanté de nombreuses écoles coraniques (daara) à travers tout le Sénégal, formant des générations de disciples. Grand savant pédagogue et gardien rigoureux de l''orthodoxie tijaniyya.',
  '{"type":"biographie","famille":"Sy","role":"4e Khalife","naissance":"1925","deces":"2012","khalifat":"1997-2012"}'
),
(
  'Khalifes de Tivaouane',
  'Serigne Cheikh Ahmed Tidiane Sy Al Maktoum — 5e Khalife',
  'fr',
  'Serigne Cheikh Ahmed Tidiane Sy Al Maktoum (né le 29 décembre 1925 à Saint-Louis – décédé le 15 mars 2017 à Dakar) est le 5e Khalife Général des Tidianes (2012-2017). Fils de Serigne Babacar Sy (1er Khalife) et de Sokhna Astou Kane, petit-fils d''El Hadji Malick Sy. Son surnom "Al Maktoum" signifie "l''Écrit, le Prédestiné". Exceptionnellement précoce : il termine le cycle des études islamiques à 14 ans et publie son premier ouvrage ("Les Vices des marabouts") à 16 ans. En 1950, il crée la première association culturelle islamique du Sénégal "Causerie musulmane instructive" et lance le journal "L''Islam éternel". Surnommé "le marabout intellectuel du Sénégal". Également entrepreneur : producteur d''arachides, industrie huilière, actionnaire de la SOCOCIM (cimenterie de Rufisque).',
  '{"type":"biographie","famille":"Sy","role":"5e Khalife","naissance":"1925","deces":"2017","khalifat":"2012-2017"}'
),
(
  'Khalifes de Tivaouane',
  'Serigne Abdoul Aziz Sy Al Amine — 6e Khalife',
  'fr',
  'Serigne Abdoul Aziz Sy Al Amine (né en 1927 à Tivaouane – décédé le 22-23 septembre 2017) est le 6e Khalife Général des Tidianes (mars-septembre 2017, environ 6 mois). Fils de Serigne Babacar Sy (1er Khalife) et de Sokhna Astou Kane, petit-fils d''El Hadji Malick Sy. Il est le neveu de Serigne Abdoul Aziz Sy Dabakh (son oncle paternel, frère de son père). Son surnom "Al Amine" (le digne de confiance, le loyal) est aussi le surnom du Prophète Muhammad avant sa mission. Il fut porte-parole officiel du Khalife général pendant des décennies. En 1968, il fonde le COSKAS (Comité d''Organisation Khalifa Ababacar Sy), structure de service d''ordre du Gamou dont les membres sont vêtus en vert. En 1962, il crée la Fédération des Associations Islamiques du Sénégal (FAIS). Il a également fondé la Zawiya El Hadji Malick Sy de New York. Ses discours sont compilés dans l''ouvrage "Al-Fayyâdh".',
  '{"type":"biographie","famille":"Sy","role":"6e Khalife","pere":"Serigne Babacar Sy","grand_pere":"El Hadji Malick Sy","naissance":"1927","deces":"2017","khalifat":"mars-sept 2017"}'
),
(
  'Khalifes de Tivaouane',
  'Serigne Babacar Sy Mansour — 7e Khalife actuel',
  'fr',
  'Serigne Babacar Sy Mansour (né en 1932) est le 7e et actuel Khalife Général des Tidianes de Tivaouane (depuis septembre 2017). Son père est Serigne Mansour Sy Balkhawmi (2e Khalife, fils direct de Maodo) et sa mère est Sokhna Aminata Seck (issue de Doudou Seck Bou Mogdad, notable de Saint-Louis). Il a effectué ses études islamiques au Sénégal puis des études supérieures au Caire (Égypte), faisant de lui un lettré arabisant. Surnommé "Pa Allemand" pour son franc-parler et son intransigeance sur les valeurs islamiques. Il est reconnu pour sa rigueur, son engagement pour l''unité nationale et sa défense des valeurs morales islamiques.',
  '{"type":"biographie","famille":"Sy","role":"7e Khalife actuel","naissance":"1932","khalifat":"2017-present"}'
);

-- ═══════════════════════════════════════════════════════════════
-- 6. GRANDES FIGURES : IBRAHIM NIASSE, EL HADJI OUMAR TALL
-- ═══════════════════════════════════════════════════════════════

INSERT INTO knowledge_chunks (source, title, language, content, metadata) VALUES
(
  'Cheikh Ibrahim Niasse — Faydatou Tijaniyya',
  'Biographie de Cheikh Ibrahim Niasse (Baye Niasse)',
  'fr',
  'Cheikh Ibrahim Niasse (8 novembre 1900 – 26 juillet 1975) est né à Taïba Niassène (Sénégal) et décédé à Londres. Fils d''Al-Hadj Abdoulaye Niasse, figure majeure de la Tijaniyya à Kaolack. En 1929, lors d''une retraite spirituelle, il se proclame héritier spirituel (Khalifa) de Cheikh Ahmad Tijani et fondateur de la Faydatou Tijaniyya. Vers 1930, il fonde sa propre communauté à Médina Baye (banlieue de Kaolack). Sa méthode distinctive est la Tarbiyya (initiation mystique accélérée vers la gnose — Ma''rifa), rendant l''éveil spirituel accessible rapidement. Sa branche (Tijaniyya Niassiyya) est devenue la plus grande branche de la Tijaniyya dans le monde, avec une influence majeure au Nigeria, Ghana, Niger, Mali, Guinée, Gambie et États-Unis. En 1971, l''Université Al-Azhar lui octroie le titre de "Cheikh Al-Islam" — premier Africain noir à diriger la prière à Al-Azhar. Il a rédigé plus de 50 ouvrages islamiques.',
  '{"type":"biographie","role":"fondateur_Fayda","naissance":"1900","deces":"1975","lieu":"Kaolack/Médina Baye"}'
),
(
  'El Hadji Oumar Tall — Empire toucouleur',
  'Biographie d''El Hadji Oumar Tall',
  'fr',
  'El Hadji Oumar Tall (entre 1794 et 1797 – 12 février 1864) est né à Halwar, Fouta-Toro (Sénégal actuel), dans une famille peule toucouleure de notables religieux. Il effectue un grand pèlerinage de 18 ans (1827-1845) : il passe par Hamdallaye, Sokoto (où il épouse la fille de Mohammed Bello), le Caire, La Mecque et Médine. À La Mecque en 1828, Muhammad al-Ghali (disciple direct du Cheikh Ahmad Tijani) lui confère le titre de Khalife de la Tijaniyya pour l''Afrique sub-saharienne. Il est ainsi le premier grand vecteur de la Tijaniyya en Afrique de l''Ouest. En 1850, il lance un jihad depuis Dinguiraye (Guinée) et fonde l''Empire toucouleur théocratique islamique, couvrant une grande partie du Sénégal, du Mali et de la Guinée actuels. Il disparaît mystérieusement dans les grottes de Bandiagara (Mali) en 1864 lors d''une révolte. Son œuvre doctrinale majeure est le Rimah hizb al-Rahim.',
  '{"type":"biographie","role":"khalife_tijaniyya_soudan","naissance":"~1797","deces":"1864"}'
);

-- ═══════════════════════════════════════════════════════════════
-- 7. GAMOU ET HISTOIRE DE LA TIJANIYYA AU SÉNÉGAL
-- ═══════════════════════════════════════════════════════════════

INSERT INTO knowledge_chunks (source, title, language, content, metadata) VALUES
(
  'Gamou de Tivaouane',
  'Histoire et déroulement du Gamou de Tivaouane',
  'fr',
  'Le Gamou de Tivaouane est la grande célébration annuelle du Mawlid (naissance du Prophète Muhammad) organisée le 12 Rabioul Awal du calendrier hégirien. Le premier Gamou public a été organisé par El Hadji Malick Sy en 1902 (1320 H) à Tivaouane. Avant lui, le Mawlid était célébré en privé dans les maisons. Malick Sy "sort la célébration dans l''espace public" pour toucher les masses. Le terme "Gamou" (Gàmmu en wolof) est emprunté aux traditions animistes préislamiques et désignait une manifestation populaire festive — Malick Sy adopte ce nom pour lui donner un caractère accessible. Déroulement : les premières nuits (1er au 11 Rabioul Awal), récitation de la Bourde (Al-Burda de l''Imam al-Busiri) ; la nuit du 12 : récitation du Khilaçu ez-Zahab (poème d''El Hadji Malick Sy sur le Prophète), veillée de dhikr, xassidas et conférences islamiques ; le lendemain : prières et ziara au mausolée de Malick Sy, discours du Khalife. Le Gamou réunit chaque année plusieurs centaines de milliers à plusieurs millions de fidèles, faisant de Tivaouane l''un des plus grands centres de pèlerinage islamique d''Afrique de l''Ouest.',
  '{"type":"evenement","frequence":"annuel","date":"12 Rabioul Awal","lieu":"Tivaouane"}'
),
(
  'Histoire de la Tijaniyya au Sénégal',
  'Chronologie et centres de la Tijaniyya au Sénégal',
  'fr',
  'Chronologie de la Tijaniyya au Sénégal : 1781 — Fondation de la Tijaniyya par Ahmad Tijani en Algérie. 1828 — El Hadji Oumar Tall reçoit à La Mecque le titre de Khalife de la Tijaniyya pour l''Afrique sub-saharienne. 1850-1864 — Jihad d''El Hadji Oumar Tall, expansion de l''Islam tijaniyya en Afrique de l''Ouest. 1888 — El Hadji Malick Sy revient de La Mecque avec le titre de Khalife de la Tijaniyya pour le Sénégal. 1902 — El Hadji Malick Sy s''installe à Tivaouane et organise le premier Gamou public. 1922 — Décès de Malick Sy, début du khalifat de Serigne Babacar Sy. 1929-1930 — Ibrahim Niasse proclame la Fayda et fonde Médina Baye (Kaolack). 1971 — Ibrahim Niasse reçoit le titre de "Cheikh Al-Islam" d''Al-Azhar. Principaux centres au Sénégal : Tivaouane (siège du Khalife, Gamou annuel) ; Médina Baye/Kaolack (Faydatou Tijaniyya d''Ibrahim Niasse, rayonnement mondial) ; Thienaba (zawiya avec son propre Gamou) ; Médina Gounass/Kolda (branche de Tierno Mamadou Saïdou Bâ). La Tijaniyya représente environ 50 à 60% de la population sénégalaise.',
  '{"type":"histoire","pays":"Sénégal"}'
);
