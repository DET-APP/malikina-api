-- Seed initial Tidiane knowledge chunks (without embeddings — full-text search fallback)
-- Embeddings can be added later once HF API access is available

INSERT INTO knowledge_chunks (source, title, language, content, metadata)
SELECT * FROM (VALUES
  (
    'Jawahirul Ma''ani',
    'Origine de la Tariqa Tijaniyya',
    'fr',
    'La Tariqa Tijaniyya a été fondée par Cheikh Ahmad ibn Muhammad al-Tijani (1737-1815), né à Ain Madhi en Algérie. Le Cheikh reçut la voie directement du Prophète Muhammad (sallallahu alayhi wa sallam) en état de veille, non en rêve. Cette transmission directe est l''un des fondements de la spécificité de la Tariqa Tijaniyya.',
    '{"chapter":"Introduction","page":1}'::jsonb
  ),
  (
    'Jawahirul Ma''ani',
    'Les piliers du Wird Tidiaan',
    'fr',
    'Le Wird Tidiaan comprend trois parties essentielles pratiquées deux fois par jour (matin et soir) : 1) L''Istighfar (demande de pardon) : "Astaghfirullah" 100 fois. 2) La Salat al-Fatihi : invocation de bénédictions sur le Prophète, récitée 100 fois. Elle est considérée équivalente à 6000 fois la Salat ordinaire selon les traditions de la voie. 3) La Haylala : "La ilaha illallah" 100 fois, puis Khatm al-Aqdar une fois.',
    '{"chapter":"Wird","page":45}'::jsonb
  ),
  (
    'Jawahirul Ma''ani',
    'La Salat al-Fatihi — Vertu et signification',
    'fr',
    'La Salat al-Fatihi (اللهم صل على سيدنا محمد الفاتح لما أغلق) est la prière centrale de la Tariqa Tijaniyya. Elle signifie : "Ô Allah, envoie Tes bénédictions sur notre Seigneur Muhammad, celui qui a ouvert ce qui était fermé, le sceau de ce qui a précédé, le défenseur de la vérité par la vérité, et le guide vers Ta droite voie." Cette invocation fut transmise au Cheikh Tijani par le Prophète lui-même.',
    '{"chapter":"Salat al-Fatihi","page":67}'::jsonb
  ),
  (
    'Jawahirul Ma''ani',
    'Conditions d''appartenance à la Tariqa',
    'fr',
    'Pour appartenir à la Tariqa Tijaniyya, le disciple doit : 1) Recevoir la wird des mains d''un Muqaddam autorisé. 2) S''engager à accomplir le wird quotidien sans interruption. 3) Ne pas pratiquer une autre tariqa simultanément. 4) Respecter les conditions posées par le Cheikh fondateur. L''abandon de la wird sans excuse valable équivaut à quitter la voie.',
    '{"chapter":"Conditions","page":89}'::jsonb
  ),
  (
    'Munyat al-Murid',
    'Le désir du disciple — Introduction',
    'fr',
    'Munyat al-Murid (Le désir du disciple) est l''un des ouvrages fondamentaux de la Tariqa Tijaniyya, rédigé par Cheikh Ahmad Skirej. Il expose les règles de conduite du murid (aspirant spirituel) sur la voie. Le murid doit cultiver la sincérité (ikhlas), l''abandon à Dieu (tawakkul) et la déférence envers son maître spirituel (shaykh).',
    '{"chapter":"Introduction","page":1}'::jsonb
  ),
  (
    'Munyat al-Murid',
    'L''adab du disciple envers le Cheikh',
    'fr',
    'L''adab (comportement) envers le cheikh comprend : le respect total de sa parole, la présence aux réunions du Wazifa et Hadra, l''amour sincère sans ostentation. Le disciple ne doit pas critiquer son cheikh même s''il lui semble voir une faute, car il manque de la vision spirituelle nécessaire. La relation avec le cheikh est une relation de cœur avant d''être une relation de forme.',
    '{"chapter":"Adab","page":34}'::jsonb
  ),
  (
    'Munyat al-Murid',
    'La Wazifa — Description et règles',
    'fr',
    'La Wazifa est la récitation collective ou individuelle comprenant : Astaghfirullah (30 fois), Salat al-Fatihi (50 fois), La ilaha illallah (100 fois), Jawharatul Kamal (12 fois) et Khatm al-Aqdar. Elle se pratique de préférence en groupe (Hadra) après la prière de l''après-midi (''Asr) le vendredi, mais peut se faire individuellement. La Wazifa est distincte du wird quotidien.',
    '{"chapter":"Wazifa","page":56}'::jsonb
  ),
  (
    'Fakihat al-Tulab',
    'Introduction à Fakihat al-Tulab',
    'fr',
    'Fakihat al-Tulab (Fruit des disciples) est un traité de Cheikh Ahmad Tijani sur les fondements spirituels de la voie. Il y explique les degrés de la walaya (sainteté) et la hiérarchie spirituelle dans la Tariqa. L''ouvrage est considéré comme une référence pour comprendre la doctrine de la khatmiyya (sceau de la walaya).',
    '{"chapter":"Introduction","page":1}'::jsonb
  ),
  (
    'Fakihat al-Tulab',
    'La Khatmiyya — Le sceau de la walaya',
    'fr',
    'Cheikh Ahmad Tijani est désigné dans la doctrine tijaniyya comme le Khatm al-Awliya (Sceau des saints), de même que Muhammad (saws) est le Khatm al-Anbiya (Sceau des prophètes). Cette doctrine signifie que la voie tijaniyya représente le sommet de la chaîne spirituelle soufie dans cette époque.',
    '{"chapter":"Khatmiyya","page":23}'::jsonb
  ),
  (
    'Seydi El Hadji Malick Sy — Biographie et œuvres',
    'Biographie de Seydi El Hadji Malick Sy',
    'fr',
    'Seydi El Hadji Malick Sy (1855-1922) est le principal propagateur de la Tariqa Tijaniyya au Sénégal et en Afrique de l''Ouest. Né à Gallé Thioro (région de Podor), il s''installe à Tivaouane qui devient le principal centre tidiaan du Sénégal. Érudit accompli, il maîtrisait l''arabe, les sciences islamiques et la poésie. Il est l''auteur de nombreux xassidas en wolof et en arabe, et de plusieurs traités théologiques.',
    '{"author":"Seydi El Hadji Malick Sy","type":"biographie"}'::jsonb
  ),
  (
    'Seydi El Hadji Malick Sy — Biographie et œuvres',
    'Rôle de Seydi Malick Sy dans la diffusion de l''Islam',
    'fr',
    'Seydi Malick Sy a joué un rôle crucial dans l''islamisation pacifique du Sénégal. Il prônait la tolérance, le savoir et la coexistence avec l''autorité coloniale française, non par soumission, mais pour préserver les communautés musulmanes. Son approche pédagogique a permis l''expansion de l''éducation islamique au Sénégal. Il fonda des daara (écoles coraniques) dans tout le pays et forma des générations d''érudits.',
    '{"author":"Seydi El Hadji Malick Sy","type":"histoire"}'::jsonb
  ),
  (
    'Seydi El Hadji Malick Sy — Biographie et œuvres',
    'Les xassidas de Seydi Malick Sy',
    'fr',
    'Seydi El Hadji Malick Sy est l''auteur de nombreux xassidas (poèmes religieux) en arabe et en wolof. Ses œuvres poétiques majeures incluent : Mawlid al-Mustafa (sur la naissance du Prophète), Isawa (sur la voie soufie), Tabat al-Abwab, et de nombreux poèmes en wolof sur la louange prophétique et les enseignements tidiaans. Ces xassidas sont récités lors des cérémonies religieuses, notamment le Gamou (Mawlid) de Tivaouane.',
    '{"author":"Seydi El Hadji Malick Sy","type":"xassidas"}'::jsonb
  ),
  (
    'Seydi El Hadji Malick Sy — Biographie et œuvres',
    'Le Gamou de Tivaouane',
    'fr',
    'Le Gamou (célébration du Mawlid an-Nabi) de Tivaouane est l''un des plus grands rassemblements islamiques d''Afrique de l''Ouest, réunissant chaque année des millions de fidèles à la date anniversaire de la naissance du Prophète Muhammad (sallallahu alayhi wa sallam). Il a été institué par Seydi El Hadji Malick Sy et est perpétué par ses successeurs (khalifes). Le Gamou comprend des récitations de Coran, de xassidas, de conférences religieuses et des prières collectives.',
    '{"author":"Seydi El Hadji Malick Sy","type":"événement"}'::jsonb
  ),
  (
    'Seydi El Hadji Malick Sy — Biographie et œuvres',
    'Jurisprudence tidiaan — Relations avec les autres voies',
    'fr',
    'La Tariqa Tijaniyya, contrairement à d''autres voies soufies, interdit à ses membres d''appartenir simultanément à une autre tariqa. Cette règle (shart al-iltizam) est fondamentale et distingue la voie tijaniyya. Cependant, le respect mutuel envers les autres voies soufies et leurs maîtres est fortement recommandé. Seydi Malick Sy enseignait que la voie ne doit jamais être source de division entre musulmans.',
    '{"type":"jurisprudence"}'::jsonb
  ),
  (
    'Doctrine et pratiques tidianes',
    'La Hadra — Réunion spirituelle',
    'fr',
    'La Hadra (présence spirituelle) est la réunion collective des tidiaans pour la récitation de la Wazifa, généralement le vendredi après ''Asr. Elle comprend la récitation collective des dhikrs, parfois accompagnée de chants religieux (xassidas). La Hadra renforce le lien fraternel entre les disciples et est considérée comme une occasion de bénédictions spirituelles particulières.',
    '{"type":"pratiques"}'::jsonb
  ),
  (
    'Doctrine et pratiques tidianes',
    'Le Muqaddam — Représentant autorisé',
    'fr',
    'Le Muqaddam est un représentant autorisé par la chaîne d''autorisation (ijaza) à transmettre le wird tidiaan. Il doit avoir reçu l''autorisation d''un Muqaddam précédent, remontant jusqu''au Cheikh fondateur. Le Muqaddam enseigne le wird aux nouveaux disciples et guide leur formation spirituelle. Au Sénégal, la chaîne passe principalement par Seydi El Hadji Malick Sy et ses successeurs à Tivaouane.',
    '{"type":"doctrine"}'::jsonb
  ),
  (
    'Doctrine et pratiques tidianes',
    'La Jawharatul Kamal — Joyau de la perfection',
    'fr',
    'La Jawharatul Kamal (جوهرة الكمال) est une invocation particulière de la Tariqa Tijaniyya, transmise directement par le Prophète (saws) au Cheikh fondateur. Elle est récitée 12 fois lors de la Wazifa. Cette invocation est considérée comme la plus haute forme de salawat dans la voie et son mérite est incommensurable selon les maîtres tidiaans. Elle ne doit être récitée que par ceux qui ont reçu l''autorisation.',
    '{"type":"pratiques"}'::jsonb
  )
) AS v(source, title, language, content, metadata)
WHERE NOT EXISTS (
  SELECT 1 FROM knowledge_chunks WHERE knowledge_chunks.source = v.source AND knowledge_chunks.title = v.title
);
