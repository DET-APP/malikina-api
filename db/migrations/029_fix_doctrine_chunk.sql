-- Migration 029: Enrichir le chunk Doctrine avec détails précis des pratiques
-- Évite que le LLM hallucine "la Wazifa varie selon la voie" ou invente des règles

UPDATE knowledge_chunks
SET
  content = 'La doctrine de la Tariqa Tijaniyya repose sur plusieurs principes fondamentaux :

1) La voie est exclusive — le disciple doit quitter tout autre ordre soufi en rejoignant la Tijaniyya. Il ne peut appartenir simultanément à une autre confrérie.

2) La transmission directe — Cheikh Tijani affirme avoir reçu la voie directement du Prophète Muhammad en état de veille (yaqazatan), non en rêve, sans intermédiaire humain vivant. C''est ce qui distingue fondamentalement la Tijaniyya des autres turuq.

3) La Khatmiyya — Cheikh Tijani est reconnu dans la doctrine comme le Khatm al-Awliya (Sceau des Saints), de même que Muhammad est le Khatm al-Anbiya (Sceau des Prophètes).

4) La supériorité de la voie — "chaque voie entre dans la nôtre" selon la doctrine tidianie.

5) Les trois pratiques obligatoires :
   - Le Wird (Lazim) : récité deux fois par jour (matin après Fajr, soir après Asr). Composé de : Istighfar ×100 + Salat al-Fatihi ×100 + Haylala (La ilaha illa-llah) ×100.
   - La Wazifa : récitée une fois par jour. Composée de : Istighfar ×30 + Salat al-Fatihi ×50 + Haylala ×100 + Jawharatul Kamal ×12. Elle est fixe et identique pour tous les disciples — elle ne varie PAS selon la voie.
   - La Haylala du vendredi (Hadra) : récitée en groupe le vendredi soir. Composée principalement de la Haylala (La ilaha illa-llah) ×1000 minimum, avec des salawat.

6) Cheikh Tijani était théologien asharite et juriste malikite. Il insistait sur la conformité stricte à la Sunna prophétique et au fiqh maliki.',
  updated_at = NOW()
WHERE title = 'Doctrine fondamentale de la Tijaniyya';
