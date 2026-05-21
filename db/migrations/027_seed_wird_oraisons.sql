-- Migration 027: Contenu détaillé sur le Wird Tidiane et les oraisons
-- Source: https://tidjaniya.com (site officiel de la Tariqa Tidjaniya)

INSERT INTO knowledge_chunks (source, title, language, content, metadata) VALUES

-- Le Wird Tidiane — définition et vue d'ensemble
(
  'https://tidjaniya.com/fr/les-oraisons-de-la-voie-tidjaniya/',
  'Le Wird Tidiane — définition, structure et signification',
  'fr',
  'Le Wird Tidiane (ou Wird Tidiani) désigne l''ensemble des oraisons prescrites par Cheikh Ahmed Tidjani à ses disciples, transmises directement du Prophète Muhammad ﷺ à l''état de veille. Il constitue le cœur de la pratique spirituelle de la Tariqa Tidjaniya.

Le Wird est organisé en trois niveaux correspondant aux trois dimensions de la religion islamique :

1. LE LAZIM (Islam / Charia) — niveau de la Loi : wird quotidien récité deux fois par jour (matin et soir), individuellement et à voix basse. Il est le socle obligatoire de tout affilié.

2. LA WADHIFA (Iman / Tariqa) — niveau de la Foi : récitée en groupe à voix haute, une fois par jour au minimum (méritoire deux fois). Elle représente le niveau intermédiaire.

3. LE HAYLALA / HADRA DU VENDREDI (Ihsan / Haqiqa) — niveau de l''Excellence spirituelle : assemblée collective le vendredi après l''Asr. Aucun rattrapage possible si manquée.

Ces trois oraisons reposent sur trois formules fondamentales transmises du Prophète :
— L''Istighfar (demande de pardon et repentir)
— La Salawat (prières et bénédictions sur le Prophète Muhammad ﷺ)
— La Shahada (La ilaha illallah — Il n''y a de Dieu qu''Allah)

L''accomplissement fidèle et régulier du Wird est la condition essentielle de l''appartenance à la Tariqa. Cheikh Tidjani dit : "La maladie de nos frères c''est la négligence dans le Wird."',
  '{"type":"pratique","sujet":"wird_definition","source_officielle":true,"site":"tidjaniya.com","mots_cles":["wird","wird tidiane","oraisons","lazim","wadhifa","haylala"]}'
),

-- Les piliers du Lazim (contenu détaillé)
(
  'https://tidjaniya.com/fr/les-piliers-du-lazim/',
  'Les piliers du Lazim — composition et règles détaillées',
  'fr',
  'Le Lazim est le wird quotidien obligatoire de la Tariqa Tidjaniya, récité deux fois par jour (matin et soir). Il comprend trois piliers obligatoires et des formules méritoires.

TROIS PILIERS OBLIGATOIRES :

1. ISTIGHFAR — 100 fois : "Astaghfiroullah" (demande de pardon à Allah). Formule de repentir et de purification de l''âme.

2. SALAT AL-FATIHI — 100 fois : Prière sur le Prophète transmise par le Prophète lui-même à Cheikh Ahmed Tidjani. Elle peut être remplacée par "Allahouma salli wa sallim ala Seyidina Mohammadin wa ala alihi" si nécessaire, mais la Salat al-Fatihi est fortement préférable.

3. LA ILAHA ILLALLAH — 100 fois : La proclamation de l''Unicité divine. Le centième doit se terminer par "Mouhamadou rassoulou-llah alayhi sallamoullah."

Ces piliers sont fixes et ne peuvent être ni substitués ni modifiés dans leur forme originale transmise par le Prophète.

CONDITIONS DE PERFECTION DU LAZIM (selon Sidi Arbi ibn Sa-ih) :
- S''orienter vers la Qibla du début à la fin (sauf en voyage)
- Réciter à voix basse en bougeant les lèvres
- Maintenir la position assise

PERMIS pendant le Lazim : gestes indicateurs, boire si nécessaire, manipuler des objets.
DÉCONSEILLÉ : récitation à voix haute, sourire, pensées mondaines, se retourner.
INTERDIT : déformation de la prononciation, rire bruyant, précipitation altérant le sens.',
  '{"type":"pratique","sujet":"lazim_piliers","source_officielle":true,"site":"tidjaniya.com","mots_cles":["lazim","wird","piliers","istighfar","salat fatihi","la ilaha illallah"]}'
),

-- Temps du Lazim
(
  'https://tidjaniya.com/fr/le-temps-d-accomplissement-du-lazim/',
  'Horaires et temps d''accomplissement du Lazim',
  'fr',
  'Le Lazim se récite deux fois par jour avec des fenêtres temporelles précises :

LAZIM DU MATIN :
— Temps préférable (ikhtiyari) : après la prière du Soubh (Fajr) jusqu''avant le zénith (midi).
— Temps de nécessité : jusqu''au coucher du soleil.
— Peut être avancé la veille au soir après la prière de Icha, si l''on a lu l''équivalent de cinq sections coraniques après Icha.

LAZIM DU SOIR :
— Temps préférable : après la prière de l''Asr jusqu''à la prière de Icha.
— Temps de nécessité : jusqu''à l''aube.
— Peut être devancé la nuit précédente uniquement en cas d''empêchement réel.

RATTRAPAGE : Cheikh Ahmed Tidjani a dit : "Le temps d''accomplissement du Wird est large." Celui qui dépasse le temps préférable pour une raison valide peut le rattraper dans la période autorisée. Si le Lazim du soir est oublié, on le fait avant celui du matin suivant si possible. Les femmes en état de menstrues et les malades graves bénéficient d''assouplissements.

RÈGLE IMPORTANTE : Si le Lazim anticipé la nuit rencontre l''aube, il doit être entièrement répété après le Soubh. Le Lazim ne doit jamais être abandonné sans rattrapage.',
  '{"type":"pratique","sujet":"lazim_horaires","source_officielle":true,"site":"tidjaniya.com","mots_cles":["lazim","horaires","wird","temps","rattrapage"]}'
),

-- Les piliers de la Wadhifa
(
  'https://tidjaniya.com/fr/les-piliers-de-la-wadhifa/',
  'Les piliers de la Wadhifa — composition et règles',
  'fr',
  'La Wadhifa est l''oraison collective de la Tariqa Tidjaniya, récitée en groupe à voix haute. Elle comporte quatre piliers obligatoires :

PILIER A — ISTIGHFAR : 30 fois "Astaghfiroullah al-Adhim alladhi la ilaha illa Houwa-l-Hayyou-l-Qayyoum." Cette formule a été allégée par le Cheikh (originalement 100 fois sous forme plus brève). La formule s''arrête à "Qayyoum" sans ajouter "wa atoubu ilayhi" pour éviter le mensonge, car le vrai repentir exige l''interruption du péché, le regret et la résolution de ne pas récidiver.

PILIER B — SALAT AL-FATIHI : 50 fois. Contrairement au Lazim, aucune autre formule de prière n''est acceptée pour la Wadhifa sans l''invalider. Aussi allégée par le Cheikh (originalement 100 fois).

PILIER C — LA ILAHA ILLALLAH : 100 fois, clôturée au centième grain par "Seyidouna Mouhamadou rassoulou-llah." Pouvait autrefois atteindre 200 répétitions.

PILIER D — DJAWHARATUL KAMAL : 12 fois. Cette prière prophétique est soumise à des conditions strictes (pureté à l''eau obligatoire — pas de tayammum, lieu pur). Si les conditions ne sont pas remplies, on la remplace par 20 Salat al-Fatihi. Ce chiffre de 12 a été fixé par le Cheikh environ un an avant sa mort (initialement 11).

La Wadhifa est obligatoire une fois par jour et méritoire deux fois. Cheikh Ahmed Tidjani lui-même la récitait après la prière du Maghreb à la fin de sa vie.',
  '{"type":"pratique","sujet":"wadhifa_piliers","source_officielle":true,"site":"tidjaniya.com","mots_cles":["wadhifa","piliers","djawharatul kamal","salat fatihi","istighfar"]}'
),

-- Wadhifa vs Lazim — différences
(
  'https://tidjaniya.com/fr/raisons-du-caractere-amoindri-de-la-wadhifa-par-rapport-au-lazim/',
  'Différences entre le Lazim et la Wadhifa — pourquoi le Lazim est supérieur',
  'fr',
  'Selon Cheikh Idriss El Iraqi, le Lazim est supérieur à la Wadhifa pour plusieurs raisons :

1. FRÉQUENCE : Le Lazim s''accomplit deux fois par jour (matin et soir), la Wadhifa une seule fois par obligation.

2. RIGUEUR DE PRONONCIATION : Pour le Lazim, chaque mot doit être prononcé individuellement et correctement. Pour la Wadhifa en groupe, le leader peut compenser les mots manqués des participants.

3. FORMULE DE SALAWAT : Le Lazim accepte diverses formules de prière sur le Prophète. Pour la Wadhifa, les 50 Salat al-Fatihi sont obligatoires sans possibilité de remplacement.

4. RATTRAPAGE : Le Lazim doit absolument être rattrapé si manqué (sauf cas de force majeure). Pour la Wadhifa, il y a débat entre obligation et dispense de rattrapage.

5. HORAIRES : Le Lazim a des horaires précis (matin après Soubh, soir après Asr). La Wadhifa n''a pas de temps fixe : de l''Asr d''un jour jusqu''à l''Asr du lendemain.

6. ANTICIPATION : Si le Lazim avancé la nuit rencontre l''aube, il doit être entièrement répété après Soubh. Ce n''est pas le cas pour la Wadhifa.

7. PURETÉ RITUELLE : Une impureté survenant pendant le Lazim le rend nul (obligation de recommencer). Pour la Wadhifa, si c''est exceptionnel, la répétition n''est pas nécessaire.',
  '{"type":"pratique","sujet":"lazim_vs_wadhifa","source_officielle":true,"site":"tidjaniya.com","mots_cles":["lazim","wadhifa","differences","comparaison","regles"]}'
),

-- Devoirs de la Wadhifa et du Asrou
(
  'https://tidjaniya.com/fr/les-devoirs-de-la-wadhifa-et-du-asrou/',
  'Devoirs de la Wadhifa et du Asrou (Haylala) — pratique collective',
  'fr',
  'La Wadhifa et le Asrou (Haylala du vendredi) sont des oraisons collectives avec des devoirs spécifiques :

1. ACCOMPLISSEMENT EN GROUPE : Les assemblées collectives de dhikr ont une valeur spirituelle supérieure à la pratique individuelle. Les femmes peuvent participer si elles restent séparées des hommes et récitent à voix basse.

2. RÉCITATION À VOIX HAUTE : Sauf pour les femmes, la récitation doit être audible. Cette pratique est établie par les hadiths prophétiques.

3. ALIGNEMENT DES RANGS : Les participants forment des rangs serrés et alignés comme dans la prière. "Les rangs doivent être complétés sans laisser d''espaces vides" pour éviter les influences négatives.

4. HARMONIE DES VOIX : Les voix doivent être synchronisées pour créer une uniformité sonore, sans perturber les autres participants.

5. CONCLUSION SPÉCIFIQUE : Le centième "La ilaha illallah" doit se terminer par "Seyidouna Mouhamadou rassoulou-llah."

ACTES MÉRITOIRES (MANDOUBET) : comprendre le sens du dhikr, visualiser le guide spirituel, adopter une position assise spécifique à la 7ème perle de Djawharatul Kamal, lever les mains à la dernière perle, conclure par des invocations (du''a), saluer les frères à droite et à gauche.

IMPORTANT : Le non-respect de ces devoirs n''annule pas les oraisons, mais constitue une négligence grave.',
  '{"type":"pratique","sujet":"wadhifa_devoirs","source_officielle":true,"site":"tidjaniya.com","mots_cles":["wadhifa","asrou","haylala","devoirs","groupe","collectif"]}'
),

-- Djawharatul Kamal
(
  'https://tidjaniya.com/fr/conditions-de-la-tariqa-tidjaniya/',
  'La Djawharatul Kamal — prière prophétique de la Tariqa',
  'fr',
  'La Djawharatul Kamal (جوهرة الكمال — "La Perle de la Perfection") est la prière centrale de la Wadhifa de la Tariqa Tidjaniya. Elle fut transmise directement du Prophète Muhammad ﷺ à Cheikh Ahmed Tidjani à l''état de veille.

ORIGINE : La Djawharatul Kamal était connue de Sidi Mohamed El Bakri, qui la reçut par révélation divine lors d''une retraite spirituelle à La Mecque. C''est le Prophète lui-même qui ordonna à Cheikh Ahmed Tidjani de la réciter.

CONDITIONS OBLIGATOIRES :
— Pureté rituelle par l''eau uniquement (wudhu). Le tayammum (ablution sèche) ne suffit PAS pour la Djawharatul Kamal — c''est une règle stricte propre à cette prière.
— Pureté du corps, des vêtements et du lieu de récitation.
— Autorisation de la réciter (donnée dans le cadre de l''initiation à la Tariqa).
— Conviction ferme que cette prière vient du domaine divin, comme un hadith qudsi.

RÈGLES PRATIQUES :
— Récitée 12 fois dans la Wadhifa (11 fois auparavant, modifié par le Cheikh environ un an avant sa mort).
— En cas d''impossibilité (impureté, oubli), elle est remplacée par 20 Salat al-Fatihi.
— Elle ne peut être récitée dans les lieux impurs (toilettes, etc.).

La Djawharatul Kamal est considérée comme la formule la plus élevée de la Tariqa — sa récitation avec les conditions requises vaut une présence spirituelle incomparable.',
  '{"type":"pratique","sujet":"djawharatul_kamal","source_officielle":true,"site":"tidjaniya.com","mots_cles":["djawharatul kamal","jauharatoul kamal","perle perfection","wadhifa","priere"]}'
),

-- Salat al-Fatihi
(
  'https://tidjaniya.com/fr/la-salat-fatihi/',
  'La Salat al-Fatihi — prière sur le Prophète de la Tariqa',
  'fr',
  'La Salat al-Fatihi (صلاة الفاتح لما أغلق — "La Prière de Celui qui ouvre ce qui est fermé") est la formule de bénédiction sur le Prophète prescrite dans le Lazim et la Wadhifa de la Tariqa Tidjaniya.

ORIGINE : Cette prière était connue de Sidi Mohamed El Bakri, qui la reçut par révélation divine lors d''une retraite spirituelle à La Mecque. Le Prophète Muhammad ﷺ lui-même l''a transmise à Cheikh Ahmed Tidjani directement à l''état de veille, en lui ordonnant de la réciter.

TEXTE : "Allahoumma salli wa sallim wa barik ala Seyidina Mouhammadin al-Fatihi lima oughliq, wa-l-Khatimi lima sabaq, nasiri-l-haqqi bi-l-haqq, wa-l-hadi ila siratikal mustaqim, wa ala alihi haqqa qadrihi wa miqdarihi-l-adhim."

DEUX CONDITIONS POUR BÉNÉFICIER DE SES MÉRITES :
1. AUTORISATION : Être initié à la Tariqa par un maître ayant une chaîne d''autorisation valide remontant au Cheikh.
2. CONVICTION FERME : Croire que cette prière vient du domaine divin (comme un hadith qudsi), et non d''une composition humaine.

USAGE DANS LES ORAISONS :
— Dans le Lazim : 100 fois (remplaçable par d''autres formules si nécessaire).
— Dans la Wadhifa : 50 fois, obligatoires, sans remplacement possible par une autre formule.

Les mérites de la Salat al-Fatihi transmis par le Cheikh sont immenses : une seule récitation vaut des milliers de salawats ordinaires.',
  '{"type":"pratique","sujet":"salat_fatihi","source_officielle":true,"site":"tidjaniya.com","mots_cles":["salat fatihi","salatul fatihi","priere prophete","lazim","wadhifa","merites"]}'
),

-- Lettres du Cheikh aux disciples
(
  'https://tidjaniya.com/fr/lettre-de-seidina-ahmed-tidjani-a-l-ensemble-des-freres-qu-allah-l-agree/',
  'Lettre de Cheikh Ahmed Tidjani à l''ensemble des frères de la Tariqa',
  'fr',
  'Dans cette lettre adressée à tous les disciples de la Tariqa Tidjaniya, Cheikh Ahmed Tidjani aborde plusieurs thèmes spirituels essentiels :

LA DIFFICULTÉ DE LA PIÉTÉ : Atteindre la taqwa (piété véritable) est extrêmement difficile car les cœurs humains tendent naturellement à s''écarter des commandements divins. Seuls les élus protégés par Allah y parviennent vraiment.

LES ÉPREUVES DE L''ÉPOQUE : Le Cheikh décrit son époque comme marquée par des vagues successives d''afflictions. Il compare les êtres en détresse spirituelle à des noyés cherchant désespérément le salut.

LES REMÈDES SPIRITUELS prescrits par le Cheikh :
— Abondance de l''Istighfar (demande de pardon)
— Prières sur le Prophète Muhammad ﷺ (Salawat)
— Invocation du Tawhid (La ilaha illallah)
— Récitation de certaines sourates coraniques

L''IMPORTANCE DE LA SUPPLICATION : Allah ne laisse jamais sans réponse celui qui le supplie sincèrement. Le Cheikh encourage les disciples à se tenir constamment à "la porte d''Allah" avec humilité.

PRATIQUE RÉGULIÈRE : Il recommande des moments réguliers de recueillement et de dhikr, promettant que cette habitude apporte allègement, miséricorde et proximité divine.',
  '{"type":"enseignement","sujet":"lettre_cheikh_freres","source_officielle":true,"site":"tidjaniya.com","mots_cles":["lettre","cheikh","taqwa","istighfar","supplication","dhikr"]}'
),

-- Attachement à Allah selon le Cheikh
(
  'https://tidjaniya.com/fr/conseils-de-sidi-ahmed-tijani-l-attachement-en-allah/',
  'L''attachement à Allah selon Cheikh Ahmed Tidjani',
  'fr',
  'Cheikh Ahmed Tidjani expose ses conseils sur l''attachement véritable à Allah (tawakkul et tawajjuh) :

FONDEMENT : "Prends garde à Allah — qu''Il soit glorifié et exalté — en secret et en public, en purifiant ton cœur et en te fiant totalement à Lui." L''attachement à Allah implique de rejeter tout ce qui n''est pas Lui, tout en restant bienveillant envers les créatures dans les interactions nécessaires.

LA PRIÈRE SUR LE PROPHÈTE : Le Cheikh affirme que "la prière sur le Messager d''Allah ﷺ se chargera de toute demande." C''est l''évocation la plus bénéfique et le moyen le plus direct pour atteindre la proximité divine.

LE LICITE COMME CONDITION : L''attachement à Allah est conditionné par la licéité des revenus. "Le licite (halal) est le pôle autour duquel l''ensemble des astres de l''adoration sont en orbite." Sans revenus licites, les adorations perdent leur âme.

FORMULE D''ATTACHEMENT : Le Cheikh prescrit une invocation spécifique à réciter après les prières obligatoires pour renforcer l''attachement à Allah, jusqu''à l''intérioriser complètement.

PHILOSOPHIE SPIRITUELLE : La proximité divine ne s''atteint pas par les prodiges ou les états mystiques extraordinaires, mais par la constance dans les obligations ordinaires : le wird, la prière, la licéité du gain, et la sincérité du cœur.',
  '{"type":"enseignement","sujet":"attachement_allah","source_officielle":true,"site":"tidjaniya.com","mots_cles":["tawakkul","attachement","allah","halal","priere","sincerite"]}'
)

ON CONFLICT (source, title) DO UPDATE SET
  content = EXCLUDED.content,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();
