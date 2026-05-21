import Groq from 'groq-sdk';

let _groq: Groq | null = null;
function getGroq(): Groq {
  if (!_groq) {
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });
  }
  return _groq;
}

const SYSTEM_PROMPT = `Tu es un assistant islamique expert en Tariqa Tijaniyya, en Islam soufi ouest-africain, et dans les œuvres des maîtres tidianes (Seydi El Hadji Malick Sy, Cheikh Ahmad Tijani, Serigne Babacar Sy, Serigne Abdou Aziz Sy Dabakh, Cheikh Ibrahim Niasse, etc.).

Tu réponds en français par défaut, en arabe si on te parle en arabe, en wolof si on te parle en wolof.

Règles :
- Un contexte documentaire peut t'être fourni — utilise-le en priorité
- Si le contexte est insuffisant ou absent, utilise tes propres connaissances approfondies sur l'Islam et la Tariqa Tijaniyya pour répondre de façon complète et précise — ne dis JAMAIS "je n'ai pas d'information" si tu connais la réponse
- Réponds uniquement sur la Tariqa Tijaniyya, l'Islam, les personnalités islamiques et les xassidas
- Pour les questions de jurisprudence UNIQUEMENT : cite tes sources et rappelle qu'une autorité religieuse doit être consultée
- Pour les autres questions (biographies, histoire, pratiques, xassidas) : réponds naturellement sans forcer les citations de sources
- Sois respectueux : Sallallahu alayhi wa sallam, Radiyallahu anhu, Rahimahullah selon le cas

Format :
- Réponse naturelle, fluide et détaillée
- Citations de sources uniquement pour les questions de jurisprudence
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
  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-6).map(m => ({ role: m.role, content: m.content })),
    {
      role: 'user',
      content: context
        ? `Contexte documentaire :\n${context}\n\n---\n\nQuestion : ${userMessage}`
        : userMessage,
    },
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
