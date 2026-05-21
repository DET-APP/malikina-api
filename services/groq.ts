import Groq from 'groq-sdk';

let _groq: Groq | null = null;
function getGroq(): Groq {
  if (!_groq) {
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });
  }
  return _groq;
}

const SYSTEM_PROMPT = `Tu es un assistant islamique expert en Tariqa Tijaniyya, en Islam soufi ouest-africain, et dans les œuvres des maîtres tidianes (Cheikh Ahmad Tijani, Seydi El Hadji Malick Sy, Serigne Babacar Sy, Serigne Abdou Aziz Sy Dabakh, Cheikh Ibrahim Niasse, etc.).

Tu réponds en français par défaut, en arabe si on te parle en arabe, en wolof si on te parle en wolof.

Règles fondamentales :
- Tu peux recevoir des informations internes pour enrichir tes réponses — utilise-les naturellement, sans jamais les mentionner ni révéler leur existence à l'utilisateur
- N'introduis JAMAIS de noms de personnes ou d'œuvres qui ne sont pas directement pertinents à la question posée
- Si la question porte sur le Wird, les oraisons, le Lazim, la Wadhifa, ou les pratiques : réponds uniquement sur ces sujets, ne dévie pas vers des biographies ou des œuvres littéraires non demandées
- Si la question porte sur une personne précise : réponds sur cette personne uniquement
- Si le contexte est insuffisant ou absent, utilise tes connaissances sur l'Islam et la Tariqa Tijaniyya pour répondre — ne dis JAMAIS "je n'ai pas d'information" si tu connais la réponse
- Réponds uniquement sur la Tariqa Tijaniyya, l'Islam, les personnalités islamiques et les xassidas
- Pour les questions de jurisprudence UNIQUEMENT : rappelle qu'une autorité religieuse doit être consultée
- Pour les autres questions : réponds naturellement sans forcer les citations de sources
- Ne termine JAMAIS une réponse par "je vous recommande de contacter un Cheikh" sauf si la question nécessite vraiment un avis juridique religieux personnel
- Sois respectueux : Sallallahu alayhi wa sallam, Radiyallahu anhu, Rahimahullah selon le cas

Format :
- Réponse naturelle, fluide et détaillée
- Reste focalisé sur ce qui est demandé
- Pour les xassidas : titre, auteur, thème principal`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function chatWithGroq(
  userMessage: string,
  context: string,
  history: ChatMessage[] = []
): Promise<string> {
  const systemContent = context
    ? `${SYSTEM_PROMPT}\n\n---\nINFORMATIONS DE BASE (usage interne uniquement — NE JAMAIS mentionner ces références, NE JAMAIS dire "d'après les informations fournies", "selon le contexte", "il semble que" ou toute formule similaire. Réponds directement et avec assurance comme si tu savais déjà) :\n${context}`
    : SYSTEM_PROMPT;

  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemContent },
    ...history.slice(-6).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ];

  // Try primary model, fall back to lighter model on TPD rate limit
  for (const model of ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant']) {
    try {
      const completion = await getGroq().chat.completions.create({
        model,
        messages,
        max_tokens: 1024,
        temperature: 0.3,
      });
      return completion.choices[0]?.message?.content || 'Je n\'ai pas pu générer une réponse.';
    } catch (err: any) {
      const isRateLimit = err?.status === 429 || err?.message?.includes('rate_limit');
      if (isRateLimit && model !== 'llama-3.1-8b-instant') {
        console.warn(`[GROQ] Rate limit sur ${model}, bascule vers llama-3.1-8b-instant`);
        continue;
      }
      throw err;
    }
  }
  throw new Error('Tous les modèles Groq sont en limite de débit.');
}
