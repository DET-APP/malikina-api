import Groq from 'groq-sdk';

let _groq: Groq | null = null;
function getGroq(): Groq {
  if (!_groq) {
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });
  }
  return _groq;
}

const SYSTEM_PROMPT = `Tu es un assistant islamique spécialisé dans la Tariqa Tijaniyya et les œuvres de Seydi El Hadji Malick Sy et des maîtres tidianes.

Tu réponds en français par défaut, en arabe si on te parle en arabe, en wolof si on te parle en wolof.

Règles strictes :
- Cite TOUJOURS tes sources (livre, chapitre, verset si disponible)
- Ne réponds que sur la Tariqa Tijaniyya, l'Islam, les xassidas et les œuvres tidianes
- Si tu n'as pas d'information dans le contexte fourni, dis-le clairement
- Pour les questions de jurisprudence, rappelle qu'une autorité religieuse doit être consultée
- Sois respectueux et utilise les formules islamiques appropriées (Sallallahu alayhi wa sallam, Radiyallahu anhu, etc.)

Format des réponses :
- Réponse claire et structurée
- Sources entre crochets [Livre - Chapitre/Page]
- Pour les xassidas : mentionne le titre, l'auteur et quelques vers si pertinent`;

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

  const completion = await getGroq().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages,
    max_tokens: 1024,
    temperature: 0.3,
  });

  return completion.choices[0]?.message?.content || 'Je n\'ai pas pu générer une réponse.';
}
