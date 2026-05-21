-- Migration 026: Enrichissement depuis tidjaniya.com (site officiel de la Tariqa Tidjaniya)
-- Source principale: https://tidjaniya.com — site officiel soutenu par la famille Tidjani
-- Contenu en français ET arabe

-- ─── FRANÇAIS ────────────────────────────────────────────────────────────────

INSERT INTO knowledge_chunks (source, title, language, content, metadata) VALUES

-- Biographie de Cheikh Ahmed Tidjani (vie complète)
(
  'https://tidjaniya.com/fr/vie-sidi-ahmed-tidjani/',
  'Sidi Ahmed Tidjani — Biographie complète',
  'fr',
  'Sidi Ahmed Tidjani est né en 1150 H (1737 apr. J.-C.) à Aïn Madhi, Algérie, dans une famille pieuse descendant du Prophète Muhammad par Hasan ibn Ali. Il mémorisa le Coran intégralement à l''âge de sept ans et reçut une formation islamique approfondie en fiqh malékite et hadith. Ses parents moururent lors d''une épidémie de peste alors qu''il avait 16 ans.

À 21 ans (1171 H), il entreprit un long voyage scientifique : Tlemcen, Fès (université al-Qarawiyyin), Tunis, Égypte. Il s''affilia à six confréries soufies et accomplit le Hajj en 1187 H. En 1196 H (âge 46), au village de Boussemghoune (Algérie), il vécut le Fath al-Akbar (Grande Ouverture spirituelle) : le Prophète Muhammad lui apparut à l''état de veille et le désigna comme son représentant direct, lui transmettant la Tariqa Tidjaniya.

En 1213 H (âge 63), il s''installa définitivement à Fès (Maroc) où il fonda sa zaouïa principale, reçut la reconnaissance du Sultan Moulay Suleiman, et dicta le Djawahir al-Ma''ani à son disciple Ali Harazim. Il était connu pour sa générosité extraordinaire : il distribuait du grain chaque semaine aux pauvres et affranchissait les esclaves.

Il décéda le 17 Chaoual 1230 H (22 septembre 1815) à Fès, à l''âge de 80 ans. Sa tombe dans la zaouïa de Fès demeure un lieu de pèlerinage pour les Tidianes du monde entier.',
  '{"type":"biographie","personnage":"Ahmed Tidjani","source_officielle":true,"site":"tidjaniya.com"}'
),

-- Généalogie de Cheikh Ahmed Tidjani
(
  'https://tidjaniya.com/fr/genealogie-ahmed-tidjani/',
  'Généalogie de Cheikh Ahmed Tidjani — Chaîne jusqu''au Prophète',
  'fr',
  'La généalogie complète de Cheikh Ahmed Tidjani remonte directement au Prophète Muhammad par la lignée suivante :

Sidi Ahmed Tidjani ← Muhammad ← al-Mukhtar ← Ahmad ← Muhammad ← Salim ← Abou al-Id ← Salim ← Ahmad al-Alwani ← Ahmad ← Ali ← Abdallah ← al-Abbas ← Abd al-Jabbar ← Idris ← Idris ← Ishaq ← Zayn al-Abidin ← Ahmad ← Muhammad al-Nafs al-Zakiyya ← Abdallah ← al-Hasan al-Muthanna ← al-Hasan ibn Ali ← Ali ibn Abi Talib et Sayyida Fatima al-Zahra (fille du Prophète Muhammad ﷺ).

Cette généalogie chérifienne (hassanite) est un élément fondamental de l''identité de la Tariqa. Cheikh Ahmed Tidjani est ainsi appelé "Sidi" (Seigneur) et ses descendants portent le titre de "Chérif" (noble descendant du Prophète).',
  '{"type":"genealogie","personnage":"Ahmed Tidjani","source_officielle":true,"site":"tidjaniya.com"}'
),

-- Les 23 conditions de la Tariqa
(
  'https://tidjaniya.com/fr/conditions-de-la-tariqa-tidjaniya/',
  'Les 23 conditions de la Tariqa Tidjaniya',
  'fr',
  'La Tariqa Tidjaniya comporte 23 conditions réparties en plusieurs catégories. Qui les remplit toutes fait partie des gens de la Voie victorieux et bien-aimés. Qui remplit les 21 premières seulement est parmi les gagnants bien-aimés.

CONDITIONS DE VALIDITÉ DU TALQIN (initiation) : (1) Le maître qui initie doit avoir une autorisation authentique remontant au Cheikh ; (2) Le postulant doit être libre de toute autre Tariqa et s''y tenir exclusivement sa vie durant ; (3) Le disciple doit être autorisé par un talqin valide.

CONDITIONS DE COMPAGNONNAGE : (4) Ne pas rendre visite aux saints vivants ou morts dans un but d''intercession (sauf les Prophètes, les Compagnons du Prophète et les frères de la Voie) ; (5) Maintenir l''amour du Cheikh sans interruption jusqu''à la mort, ainsi que de son khalife successeur ; (6) N''émettre aucune hostilité, haine ou inimitié envers le Cheikh ; (7) Croire fermement en le Cheikh et tenir ses paroles pour conformes au Coran et à la Sunna ; (8) Être à l''abri de toute critique envers le Cheikh.

CONDITIONS GÉNÉRALES : (9) Préserver les obligations de la Charia, notamment les cinq prières en congrégation et la bonté filiale ; (10) Ne jamais se sentir à l''abri de la ruse divine ; (11) Accomplir les oraisons jusqu''à la mort ; (12) Se réunir pour la Wadhifa et le dhikr du Haylala après l''Asr du vendredi ; (13) Ne réciter Djawharatul Kamal que dans un état de pureté par l''eau (non par le tayammum) ; (14) Éviter toute rupture avec l''ensemble des créatures, en particulier avec les frères de la Voie.

CONDITIONS DE VALIDITÉ DES ORAISONS : (18) L''intention ; (19) La pureté rituelle (ablution à l''eau ou tayammum) et la pureté du corps, des vêtements et du lieu ; (20) Couvrir les parties intimes et s''asseoir orienté vers la Qibla sauf en voyage ; (21) Ne pas parler sauf nécessité.

CONDITIONS COMPLÉMENTAIRES : (22) Visualiser l''image du Cheikh depuis le début jusqu''à la fin du dhikr, et par-dessus tout visualiser le Prophète ﷺ ; (23) S''efforcer de comprendre le sens des formules du dhikr.',
  '{"type":"pratique","sujet":"conditions_tariqa","source_officielle":true,"site":"tidjaniya.com"}'
),

-- Les oraisons (Lazim, Wadhifa, Haylala)
(
  'https://tidjaniya.com/fr/les-oraisons-de-la-voie-tidjaniya/',
  'Les oraisons de la Tariqa Tidjaniya — Lazim, Wadhifa, Haylala',
  'fr',
  'La Tariqa Tidjaniya comporte trois oraisons fondamentales correspondant aux trois dimensions de l''Islam :

LE LAZIM (niveau Islam / Charia) : Récité individuellement à voix basse deux fois par jour (matin et soir). Comprend : Istighfar (demande de pardon) 100 fois, Salat al-Fatihi 100 fois, La ilaha illallah 100 fois. C''est le wird quotidien obligatoire pour tout initié.

LA WADHIFA (niveau Iman / Tariqa) : Récitée en groupe à voix haute, une à deux fois par jour. Comprend : Istighfar 30 fois, Salat al-Fatihi 50 fois, La ilaha illallah 100 fois, Djawharatul Kamal 12 fois avec certaines conditions. Elle symbolise le niveau intermédiaire du cheminement spirituel.

LE HAYLALA / HADRA DU VENDREDI (niveau Ihsan / Haqiqa) : Pratique hebdomadaire collective le vendredi après l''Asr (entre la prière de l''après-midi et le coucher du soleil). Elle est récitée à voix haute en groupe. Pas de rattrapage (qadha) possible si manquée. Elle représente le niveau le plus élevé de la pratique spirituelle tidjanite.

Ces trois oraisons s''appuient sur trois fondements : l''Istighfar (repentir auprès d''Allah), les Salawat (prières sur le Prophète Muhammad), et la Shahada (La ilaha illallah). Chaque formule a des mérites spirituels immenses transmis par le Cheikh directement du Prophète.',
  '{"type":"pratique","sujet":"oraisons","source_officielle":true,"site":"tidjaniya.com"}'
),

-- Règles des oraisons
(
  'https://tidjaniya.com/fr/introduction-aux-regles-des-oraisons/',
  'Règles de validité des oraisons tidianes',
  'fr',
  'Cinq conditions s''appliquent au Lazim, à la Wadhifa et au Haylala :

1. PURETÉ RITUELLE : L''ablution (wudhu) à l''eau est requise, ou le tayammum si l''eau est indisponible selon les critères légaux. Exception : la femme ayant ses menstrues a le choix pour le Lazim ; elle est dispensée de la Wadhifa.

2. PURETÉ DU CORPS, DES VÊTEMENTS ET DU LIEU : Mêmes critères que pour la prière. En cas de doute sur la pureté du lieu, on peut étendre quelque chose de pur dessus.

3. COUVERTURE DES PARTIES INTIMES : Obligatoire pour hommes et femmes, comme dans la prière.

4. INTENTION : Elle doit être explicitement dirigée vers l''oraison spécifique (matin ou soir). L''intention est un acte du cœur, sans nécessité de la prononcer.

5. SILENCE DURANT LES ORAISONS : Parler plusieurs paroles invalide l''oraison. Une ou deux paroles ne nuisent pas. Exceptions : répondre aux parents, au mari (pour la femme), ou au maître spirituel.

RÉPARATIONS (JABR) : En cas de doute sur le nombre récité, on construit sur la certitude et rajoute 100 Istighfar avec intention de réparation. Une omission par oubli se complète puis se répare avec 100 Istighfar. L''absence de concentration (hudhur) se répare par 3 récitations de Djawharatul Kamal.',
  '{"type":"pratique","sujet":"regles_oraisons","source_officielle":true,"site":"tidjaniya.com"}'
),

-- Mérites de la Tariqa
(
  'https://tidjaniya.com/fr/les-merites-et-graces-de-la-tariqa-tidjaniya/',
  'Les 40 mérites et grâces de la Tariqa Tidjaniya',
  'fr',
  'La Tariqa Tidjaniya comporte quarante mérites accordés à ses affiliés, répartis en deux catégories :

PREMIÈRE CATÉGORIE (14 mérites) — pour quiconque aime Sidi Ahmed Tidjani avec soumission et respect, même sans l''avoir rencontré :
Parmi ces mérites : la mort en état de foi (musulman croyant), l''allègement de l''agonie de la mort, le pardon des péchés passés et futurs, la protection lors du jugement divin, l''intercession prophétique, l''entrée au Paradis sans châtiment.

DEUXIÈME CATÉGORIE (26 mérites supplémentaires) — pour les disciples officiellement affiliés qui accomplissent les oraisons :
Parmi ces mérites : une récompense centuplée pour chaque acte d''obéissance, l''accompagnement d''anges lors des invocations, la présence du Prophète Muhammad au moment de la mort, l''assistance divine lors de l''interrogatoire dans la tombe (par les anges Munkar et Nakir), et des grâces s''étendant à certains proches et descendants.

Ces mérites sont transmis dans les œuvres fondamentales de la Tariqa comme le Djawahir al-Ma''ani et le Kachf al-Hijab, et sont considérés comme des grâces accordées directement par le Prophète à Cheikh Ahmed Tidjani.',
  '{"type":"enseignement","sujet":"merites_tariqa","source_officielle":true,"site":"tidjaniya.com"}'
),

-- Sidi Hajj Ali Tamacini (1er khalife)
(
  'https://tidjaniya.com/fr/sidi-hajj-ali-tamacini-qu-allah-l-agree/',
  'Sidi Hajj Ali Tamacini — 1er Khalife désigné de la Tariqa',
  'fr',
  'Sidi Hajj Ali Tamacini (1180-1260 H / 1766-1844) est un Chérif hassanite dont l''ancêtre venait de Yanbu'' en Arabie. Il naquit à Tamacine, dans le sud-est algérien (wilaya de Ouargla). Première rencontre avec Cheikh Tidjani à 23 ans (1203 H) par l''intermédiaire de Sidi Mohamed ibn Mechri. Il rendit environ quatorze visites à Fès et accompagna le Cheikh de nombreuses années.

Le Cheikh lui conférait un rang exceptionnel, lui faisant diriger la prière devant les autres savants : "Cet homme a le Fath (l''ouverture spirituelle) et la prière derrière quelqu''un qui a le Fath est acceptée." Il reçut des prodiges notables, dont une grappe de dattes apparue miraculeusement devant le Cheikh.

Trois jours avant sa mort, Cheikh Ahmed Tidjani lui remit personnellement par écrit la lieutenance (khilafat) : "Notre affaire (Tariqa) se donne de vivant à vivant et tu es mon lieutenant pour elle après moi." Il lui confia ses enfants, ses épouses et l''ensemble de ses disciples.

Après le décès du maître en 1230 H, Tamacini devint le pôle spirituel de la communauté Tidjaniya. Des foules affluaient de partout pour recevoir l''initiation — un jour environ 200 personnes vinrent simultanément demander le Taqdim. Il décéda en 1260 H et fut inhumé à Tamacine. Sa tombe est un lieu de pèlerinage.',
  '{"type":"biographie","personnage":"Ali Tamacini","role":"1er khalife","naissance":"1180H","deces":"1260H","source_officielle":true,"site":"tidjaniya.com"}'
),

-- Sidi Hajj Ali Harazim (auteur du Djawahir al-Ma''ani)
(
  'https://tidjaniya.com/fr/sidi-hajj-ali-harazim-berada-qu-allah-l-agree/',
  'Sidi Hajj Ali Harazim Berada — Auteur du Djawahir al-Ma''ani',
  'fr',
  'Sidi Hajj Ali Harazim Berada est l''un des plus éminents compagnons de Cheikh Ahmed Tidjani. Cheikh Tidjani révéla que le Prophète lui dit de lui : "Il est pour toi au rang d''Abou Bakr pour moi" et "au rang de Haroun pour Moussa."

Leur première rencontre eut lieu à Oujda en 1191 H, lors du voyage du Cheikh vers Fès. Tidjani révéla à Harazim une vision que ce dernier avait oubliée, établissant leur lien spirituel.

Sa contribution majeure : il rédigea et organisa le Djawahir al-Ma''ani (Joyaux des sens) entre Cha''ban et Dhou al-Qa''da, sur ordre de Cheikh Tidjani. Ce livre — le plus important de la Tariqa — transcrit les enseignements du Cheikh. Le Prophète aurait dit : "Mon livre est celui-là et c''est moi qui l''ai rédigé."

Après son illumination spirituelle (Fath), le Cheikh l''envoya au Hijaz pour transmettre la Tariqa. En Égypte, il reçut l''instruction d''enseigner les disciples. Tragiquement, à Badr en 1218 H, après avoir récité des invocations devant la tombe prophétique, ses compagnons le crurent mort et l''enterrèrent vivant — une fin mystique interprétée comme une union spirituelle définitive.',
  '{"type":"biographie","personnage":"Ali Harazim","role":"compagnon_auteur","oeuvre":"Djawahir al-Maani","source_officielle":true,"site":"tidjaniya.com"}'
),

-- Sidi Mohamed Ibn Arabi Damraoui
(
  'https://tidjaniya.com/fr/sidi-mohamed-ibn-arabi-damraoui-qu-allah-l-agree/',
  'Sidi Mohamed Ibn Arabi Damraoui — Compagnon du Prophète et du Cheikh',
  'fr',
  'Sidi Mohamed Ibn Arabi Damraoui était originaire de Taza (Maroc). En raison de sa grande modestie, Cheikh Ahmed Tidjani lui confiait le rôle d''intermédiaire avec le Prophète Muhammad. Malgré son jeune âge, il rencontrait fréquemment le Prophète à l''état de veille — jusqu''à vingt-quatre fois en une journée selon les récits.

Le Prophète recommanda au Cheikh de prendre grand soin de lui. Durant la période à Boussemghoune, Cheikh Tidjani visitait régulièrement Taza pour le voir.

Parmi ses prodiges : la réception de poèmes et d''enseignements directement du Prophète, la capacité de faire venir la pluie pour ses plantations, et des faits extraordinaires lors de ses voyages.

Il fut assassiné à Aïn Madhi (Algérie) à l''âge de 28 ans, laissant deux filles. Bien qu''il avait prévu cet assassinat par ses dons de clairvoyance, il l''accepta comme décret divin. Allah punit sévèrement ses assassins. Après sa mort, le Cheikh le remplaça par Sidi Hajj Ali Harazim "sur commandement du Prophète lui-même." Sa tombe est un lieu de bénédiction.',
  '{"type":"biographie","personnage":"Ibn Arabi Damraoui","role":"compagnon","source_officielle":true,"site":"tidjaniya.com"}'
),

-- Succession des Khalifes de la Tariqa (Fès)
(
  'https://tidjaniya.com/fr/caliphes-suivants/',
  'Les Khalifes successeurs de la Tariqa Tidjaniya (Fès)',
  'fr',
  'Avant son décès, Cheikh Ahmed Tidjani confia la direction à Sidi Hajj Ali Tamacini et la tutelle de ses deux jeunes fils. Après le décès de Tamacini, le khalifat revint à la descendance directe du fondateur à Fès.

Voici la liste des Khalifes successeurs à la tête de la Tariqa à Aïn Madhi / Fès :
— Sidi Bachir Tidjani (1896-1910)
— Sidi Allal Tidjani (1910-1919)
— Sidi Mohamed El Kebir Tidjani (1919-1931)
— Sidi Mahmoud Tidjani (1931-1934)
— Sidi Taïeb Tidjani (1934-1973)
— Sidi Ali Tidjani (1973-1990)
— Sidi Abdeljabbar Tidjani (1990-2005)
— Sidi Hajj M''hammed Tidjani (2006-2010)
— Sidi Ali Tidjani (Bel Arbi) — depuis octobre 2010, 12ème successeur, basé à Aïn Madhi

Le représentant actuel en Afrique subsaharienne est Sidi Chérif AbdelMoutaleb Tijani, basé à Dakar (Sénégal). Le représentant au Maroc est Sidi Chérif Zoubir Tijani, gardien de la zaouïa de Fès où repose le corps de Sidi Ahmed Tidjani.',
  '{"type":"histoire","sujet":"khalifes_fes","source_officielle":true,"site":"tidjaniya.com"}'
),

-- Lieux bénis
(
  'https://tidjaniya.com/fr/category/lieux-benis-de-la-voie/',
  'Les lieux bénis de la Tariqa Tidjaniya',
  'fr',
  'Trois lieux sont particulièrement sacrés pour la Tariqa Tidjaniya :

AÏN MADHI (Algérie) : Village natal de Sidi Ahmed Tidjani, dans la wilaya de Laghouat. L''ancienne ville (La vieille Aïn Madhi) est considérée comme "le berceau de la Tariqa Tidjaniya". Le Cheikh y vécut ses premières années avant ses voyages. La zaouïa d''Aïn Madhi abrite aujourd''hui le siège du Khalife mondial Sidi Ali Bel Arbi Tidjani.

BOUSSEMGHOUNE (Algérie) : Village oasis où le Cheikh vécut le Fath al-Akbar en 1196 H — la Grande Ouverture spirituelle lors de laquelle le Prophète Muhammad lui apparut à l''état de veille et lui transmit la Tariqa. Ce lieu est la naissance spirituelle de la Tariqa Tidjaniya.

FÈS (Maroc) : Capitale spirituelle de la Tariqa depuis 1213 H quand le Cheikh s''y installa. La zaouïa de Fès abrite le mausolée de Sidi Ahmed Tidjani, gardé par Sidi Chérif Zoubir Tijani. C''est le lieu de pèlerinage principal des Tidianes du monde entier, notamment lors du Mawlid an-Nabawi.',
  '{"type":"histoire","sujet":"lieux_benis","source_officielle":true,"site":"tidjaniya.com"}'
),

-- Principaux ouvrages de la Tariqa
(
  'https://tidjaniya.com/fr/principaux-ouvrages-tariqa/',
  'Les principaux ouvrages de la Tariqa Tidjaniya',
  'fr',
  'Trois livres fondamentaux constituent la référence doctrinale de la Tariqa Tidjaniya :

1. DJAWAHIR AL-MA''ANI (جواهر المعاني) — "Les Joyaux des sens" : Rédigé par Sidi Ali Harazim Berada sur ordre du Cheikh. C''est le livre le plus important de la Tariqa, contenant l''ensemble des enseignements de Sidi Ahmed Tidjani. Le Prophète Muhammad aurait dit à son sujet : "Mon livre est celui-là et c''est moi qui l''ai rédigé." Il couvre la doctrine, les pratiques, les mérites, les conditions d''affiliation et les enseignements ésotériques de la Voie.

2. KACHF AL-HIJAB (كشف الحجاب) — "Le Levé du voile" : Ouvrage complémentaire au Djawahir al-Ma''ani, traitant des aspects mystiques et spirituels de la Tariqa. Il dévoile les réalités cachées de la Voie et les stations spirituelles (maqamat).

3. BUGHIYAT AL-MUSTAFID (بغية المستفيد) — "L''Intention de celui qui en tire profit" : Guide pratique pour les disciples, couvrant les règles d''application des oraisons, les conditions d''affiliation, et les réponses aux questions courantes des initiés.

Ces trois œuvres sont les sources doctrinales de référence que tout Mouqadem (maître transmetteur) doit maîtriser.',
  '{"type":"connaissance","sujet":"ouvrages_tariqa","source_officielle":true,"site":"tidjaniya.com"}'
),

-- Conseils et lettres de Cheikh Ahmed Tidjani
(
  'https://tidjaniya.com/fr/conseils-ecrits-par-sidi-ahmed-tijani-qu-allah-l-agree/',
  'Conseils et lettres de Cheikh Ahmed Tidjani à ses disciples',
  'fr',
  'Les conseils écrits de Cheikh Ahmed Tidjani à ses disciples couvrent plusieurs thèmes spirituels fondamentaux :

LES TROIS CAUSES DU SALUT ET DE LA PERDITION : La crainte d''Allah en secret et en public, la parole véridique (dans la richesse comme dans la pauvreté) sont causes de salut. L''avarice, les passions et l''amour-propre excessif sont causes de perdition.

GESTION DES CONFLITS ET DES PRÉJUDICES : Face aux torts subis, le Cheikh recommande une progression spirituelle : d''abord l''indulgence, puis le pardon, puis la patience, et en dernier recours la défense digne de soi. Il conseille de chercher la protection divine plutôt que la vengeance.

PRATIQUES SPIRITUELLES RECOMMANDÉES : Trois oraisons particulières : Hisbou Saïfi, Mousaba''at al-Achra, et Salat al-Fatihi. Le Cheikh affirme qu''aucune action ne peut les surpasser en mérite.

VIE COMMUNAUTAIRE : Préserver les liens familiaux, pardonner les fautes, éviter la médisance (ghiba), accepter les excuses avec bienveillance.

POUR LES MOUQADEMS : Le maître transmetteur doit traiter les disciples avec douceur, faciliter plutôt que compliquer, et s''abstenir de demander des dons matériels.

MISE EN GARDE : Ne jamais utiliser les bienfaits divins dans des actes répréhensibles. Se sentir à l''abri du péché est un signe de perdition spirituelle. Les péchés majeurs ont des conséquences éternelles.',
  '{"type":"enseignement","sujet":"conseils_cheikh","source_officielle":true,"site":"tidjaniya.com"}'
),

-- Cheminement spirituel dans la Tariqa
(
  'https://tidjaniya.com/fr/le-cheminement-par-la-voie-la-plus-droite-dans-la-tariqa-tidjaniya-partie-1/',
  'Le cheminement spirituel dans la Tariqa Tidjaniya',
  'fr',
  'Le cheminement dans la Tariqa Tidjaniya repose sur trois questions fondamentales que tout disciple doit se poser :
1. As-tu vraiment compris et respecté les conditions de la Tariqa ?
2. Suis-tu véritablement le sentier déterminé par le Pôle Caché (le Cheikh) ?
3. Appliques-tu l''enseignement complet du Cheikh ?

FONDEMENT ESSENTIEL : L''amour sincère envers Cheikh Ahmed Tidjani est le fondement du cheminement, mais cet amour doit s''accompagner d''une obéissance pratique. "L''amour sans action n''a point d''intérêt."

RECTITUDE vs MIRACLES : Le Cheikh cachait ses prodiges et n''aimait pas les laisser paraître. L''accent est mis sur la perfection éthique visible plutôt que sur les manifestations surnaturelles. La droiture morale (istiqama) prime sur les karamat (miracles).

LA SINCÉRITÉ (IKHLAS) : Trois degrés de sincérité : les adorateurs motivés par la crainte de l''enfer, ceux motivés par l''espoir du paradis, et les mystiques mus uniquement par la connaissance d''Allah (ma''rifa), sans attachement aux récompenses. Ce troisième degré est le but ultime du cheminement tidjanite.

AVERTISSEMENT : Préserver la pureté doctrinale en n''ajoutant ni ne retranchant quoi que ce soit à l''enseignement original du Cheikh. Toute innovation (bid''a) dans la Voie est une déviation.',
  '{"type":"enseignement","sujet":"cheminement_spirituel","source_officielle":true,"site":"tidjaniya.com"}'
)

ON CONFLICT (source, title) DO UPDATE SET
  content = EXCLUDED.content,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

-- ─── ARABE ───────────────────────────────────────────────────────────────────

INSERT INTO knowledge_chunks (source, title, language, content, metadata) VALUES

-- حياة سيدي أحمد التجاني
(
  'https://tidjaniya.com/ar/vie-sidi-ahmed-tidjani/',
  'سيدي أحمد التجاني — السيرة الكاملة',
  'ar',
  'ولد سيدي أحمد التجاني سنة 1150 هـ (1737 م) بقرية عين ماضي بالجزائر، في أسرة تقية شريفة تنتسب إلى الحسن بن علي رضي الله عنهما. حفظ القرآن الكريم كاملاً في سن السابعة، وتلقى تكويناً علمياً رفيعاً في الفقه المالكي والحديث. توفي والداه بالطاعون وعمره ستة عشر عاماً.

في سن الحادية والعشرين (1171 هـ) انطلق في رحلة علمية طويلة: تلمسان، فاس (جامعة القرويين)، تونس، مصر، ثم أدى فريضة الحج سنة 1187 هـ. انتسب إلى ست طرق صوفية وتلقى العلم على يد كبار الشيوخ.

سنة 1196 هـ وعمره ست وأربعون سنة، بقصر أبي سمغون (الجزائر)، وقع الفتح الأكبر: رأى النبي صلى الله عليه وسلم يقظةً لا مناماً، فأعلمه بأنه خليفته المباشر وسلّم إليه الطريقة التجانية مباشرة.

سنة 1213 هـ استقر نهائياً بمدينة فاس (المغرب) حيث أسس زاويته الكبرى، ونال اعتراف السلطان مولاي سليمان، وأملى على تلميذه علي حرازم كتاب "جواهر المعاني". كان معروفاً بسخاء نادر: يوزع الدقيق أسبوعياً على الفقراء ويعتق الرقاب.

توفي رضي الله عنه يوم 17 شوال 1230 هـ (22 سبتمبر 1815م) بفاس عن عمر ثمانين سنة. ضريحه بالزاوية التجانية بفاس قبلة لحجاج التجانيين من أنحاء العالم.',
  '{"type":"biographie","personnage":"Ahmed Tidjani","source_officielle":true,"site":"tidjaniya.com","langue_originale":"ar"}'
),

-- شروط الطريقة التجانية (arabe complet)
(
  'https://tidjaniya.com/ar/شروط-الطريقة-التجانية/',
  'شروط الطريقة التجانية الثلاثة والعشرون',
  'ar',
  'شروط الطريقة التجانية ثلاثة وعشرون شرطاً، من استكملها كلها فهو من أهل الطريقة الفائزين المحبوبين المقربين، ومن استكمل الإحدى والعشرين شرطاً الأولى فقط فهو من الرابحين المحبوبين وإن لم يساوِ الأولين.

شروط صحة التلقين:
(1) كون الشيخ الذي يلقن مأذوناً بالتلقين ممن صح إذنه عن الشيخ رضي الله عنه وإن تعددت الوسائط.
(2) أن يكون طالب التلقين خالياً من أوراد المشايخ أو منسلخاً عنها، أي الانفراد بهذه الطريقة طول الحياة فلا يجمع معها طريقة أو ورد لغيرها.
(3) كون التلميذ مأذوناً في الذكر بتلقين صحيح ممن كان له إذن صحيح.

شروط الصحبة:
(4) عدم زيارة أحد من الأولياء الأحياء والأموات مع تعظيمهم ومحبتهم وإكرامهم جميعاً، والاقتصار في الزيارة على من أذن الشيخ رضي الله عنه في زيارتهم وهم الأنبياء وأصحاب النبي ﷺ والإخوان في الطريقة.
(5) دوام محبة الشيخ بلا انقطاع إلى الممات، وخليفة الشيخ من بعده.
(6) أن لا يصدر منه سب ولا بغض ولا عداوة في جانب الشيخ رضي الله عنه.
(7) الاعتقاد في الشيخ رضي الله عنه وتصديقه في جميع أقواله فإنها مطابقة للكتاب والسنة.
(8) السلامة من الانتقاد على الشيخ رضي الله عنه.

الشروط العامة:
(9) دوام المحافظة على سائر الأمور الشرعية ومن ذلك المحافظة على الصلوات الخمس في الجماعة وبر الوالدين.
(10) عدم الأمن من مكر الله عز وجل.
(11) مداومة الورد إلى الممات.
(12) الاجتماع للوظيفة وذكر الهيللة بعد عصر يوم الجمعة.
(13) أن لا تُقرأ جوهرة الكمال إلا بالطهارة المائية لا بالترابية.
(14) عدم وقوع المقاطعة بينه وبين جميع الخلق ولا سيما بينه وبين إخوانه في الطريقة.
(15) عدم التهاون بالورد كتأخيره عن وقته من غير عذر.
(16) عدم التصدر لإعطاء الورد من غير إذن صحيح في الإعطاء.
(17) احترام كل من كان منتسباً إلى الشيخ رضي الله عنه وخاصة الكبار أهل الخصوصية.

شروط صحة الأوراد:
(18) النية.
(19) طهارة الحدث بالماء أو التيمم، وطهارة الخبث من البدن والثوب والمكان.
(20) ستر العورة والجلوس واستقبال القبلة إلا لسفر.
(21) عدم الكلام إلا لضرورة إن لم تكفِ الإشارة.

الشروط المكملة:
(22) استحضار صورة القدوة من أول الذكر إلى آخره والاستمداد منه، وأعظم من ذلك استحضار صورة النبي ﷺ.
(23) استحضار معاني ألفاظ الذكر قدر الاستطاعة.',
  '{"type":"pratique","sujet":"conditions_tariqa","source_officielle":true,"site":"tidjaniya.com","langue_originale":"ar"}'
),

-- أوراد الطريقة التجانية
(
  'https://tidjaniya.com/ar/أوراد-الطريقة-التجانية/',
  'أوراد الطريقة التجانية — اللازم والوظيفة والهيللة',
  'ar',
  'للطريقة التجانية ثلاثة أوراد أساسية تقابل مراتب الدين الثلاث:

اللازم (مرتبة الإسلام / الشريعة): يُتلى سراً مرتين يومياً منفرداً (صباحاً ومساءً). يتضمن: الاستغفار 100 مرة، صلاة الفاتح لما أغلق 100 مرة، لا إله إلا الله 100 مرة. هو الورد اليومي الواجب على كل منتسب.

الوظيفة (مرتبة الإيمان / الطريقة): تُؤدى جهراً جماعةً مرةً في اليوم على الأقل أو مرتين. تتضمن: الاستغفار 30 مرة، صلاة الفاتح 50 مرة، لا إله إلا الله 100 مرة، جوهرة الكمال 12 مرة بشروطها. تمثل المرتبة الوسطى في السلوك الروحاني.

الهيللة / حضرة الجمعة (مرتبة الإحسان / الحقيقة): تُقام جماعةً بعد عصر يوم الجمعة جهراً، ولا قضاء لها إذا فاتت. هي أرقى مراتب العبادة في الطريقة التجانية.

ترتكز هذه الأوراد الثلاثة على ثلاثة أركان: الاستغفار (التوبة إلى الله)، والصلاة على النبي محمد ﷺ، والشهادة (لا إله إلا الله). لكل صيغة فضائل روحانية عظيمة نُقلت عن الشيخ مباشرةً عن النبي ﷺ.',
  '{"type":"pratique","sujet":"oraisons","source_officielle":true,"site":"tidjaniya.com","langue_originale":"ar"}'
),

-- نسب سيدي أحمد التجاني
(
  'https://tidjaniya.com/ar/genealogie-ahmed-tidjani/',
  'نسب سيدي أحمد التجاني الشريف إلى النبي ﷺ',
  'ar',
  'سلسلة نسب القطب المكتوم سيدي أحمد التجاني رضي الله عنه:

سيدي أحمد التجاني ابن محمد ابن المختار ابن أحمد ابن محمد ابن سالم ابن أبي العيد ابن سالم ابن أحمد العلواني ابن أحمد ابن علي ابن عبد الله ابن العباس ابن عبد الجبار ابن إدريس ابن إدريس ابن إسحاق ابن زين العابدين ابن أحمد ابن محمد النفس الزكية ابن عبد الله ابن الحسن المثنى ابن الحسن السبط ابن علي بن أبي طالب كرم الله وجهه والسيدة فاطمة الزهراء رضي الله عنها سيدة نساء أهل الجنة وبنت سيد الخلق سيدنا محمد صلى الله عليه وسلم.

هذا النسب الشريف الحسني يثبت انتساب الشيخ مباشرةً إلى آل بيت النبي ﷺ، وهو ركيزة أساسية في هوية الطريقة التجانية. ولهذا يُلقَّب الشيخ وذريته بلقب "سيدي" و"الشريف".',
  '{"type":"genealogie","personnage":"Ahmed Tidjani","source_officielle":true,"site":"tidjaniya.com","langue_originale":"ar"}'
),

-- خلفاء الطريقة التجانية
(
  'https://tidjaniya.com/ar/caliphes-suivants/',
  'خلفاء الطريقة التجانية بعد الشيخ',
  'ar',
  'قبل وفاته أسند سيدي أحمد التجاني الخلافة إلى سيدي الحاج علي تماسين، وأوصاه بأولاده الصغار. بعد وفاة تماسين، آلت الخلافة إلى ذرية الشيخ بفاس وعين ماضي.

قائمة خلفاء الطريقة التجانية بعد سيدي أحمد التجاني:
— سيدي بشير التجاني (1896-1910)
— سيدي علال التجاني (1910-1919)
— سيدي محمد الكبير التجاني (1919-1931)
— سيدي محمود التجاني (1931-1934)
— سيدي الطيب التجاني (1934-1973)
— سيدي علي التجاني (1973-1990)
— سيدي عبد الجبار التجاني (1990-2005)
— سيدي الحاج محمد التجاني (2006-2010)
— سيدي علي التجاني (بل عربي) — منذ أكتوبر 2010، الخليفة الثاني عشر، مقيم بعين ماضي

الممثل الحالي في غرب أفريقيا هو سيدي شريف عبد المطلب التجاني، مقيم بمدينة داكار (السنغال). الممثل بالمغرب هو سيدي شريف زبير التجاني، أمين زاوية فاس حيث يرقد جسد سيدي أحمد التجاني.',
  '{"type":"histoire","sujet":"khalifes","source_officielle":true,"site":"tidjaniya.com","langue_originale":"ar"}'
)

ON CONFLICT (source, title) DO UPDATE SET
  content = EXCLUDED.content,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();
