import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic();

interface QA { question: string; answer: string }
interface AnswerGroup {
  conceptIndex: number;
  concept: string;
  questionsAndAnswers: QA[];
}

export async function POST(req: Request) {
  try {
    const { capTitle, keyConcepts, explicarAnswers } = await req.json() as {
      capTitle: string;
      keyConcepts: string[];
      explicarAnswers: AnswerGroup[];
    };

    const answersText = explicarAnswers
      .map((a) =>
        `Concepto: "${a.concept}"\n` +
        a.questionsAndAnswers
          .map((qa, i) => `  [índice ${i}] Pregunta: ${qa.question}\n           Respuesta: ${qa.answer}`)
          .join('\n')
      )
      .join('\n\n');

    const prompt = `Eres un tutor de física para estudiantes de 10 a 14 años. El estudiante acaba de responder preguntas de comprensión sobre "${capTitle}".

Conceptos clave del tema: ${keyConcepts.join(' | ')}

Respuestas del estudiante (cada pregunta tiene un [índice] 0, 1 o 2):
${answersText}

Tu tarea: identifica los conceptos donde el estudiante muestra comprensión INCOMPLETA o INCORRECTA. Para cada laguna, prepara:
1. El índice (0, 1 o 2) de la pregunta que mejor evidencia la laguna detectada
2. Una explicación clara y sencilla (2-3 oraciones, lenguaje para 10-14 años, usa analogías cotidianas)
3. Una pregunta específica para verificar si ahora lo entendió

Si el estudiante demuestra comprensión correcta de TODOS los conceptos, devuelve items vacío.

Responde ÚNICAMENTE con JSON válido, sin texto adicional:
{
  "items": [
    {
      "conceptIndex": <número 0-6>,
      "concept": "<nombre exacto del concepto>",
      "relevantQuestionIndex": <0, 1 o 2 — índice de la pregunta más relacionada con la laguna>,
      "aiExplanation": "<explicación clara para el estudiante, 2-3 oraciones>",
      "targetedQuestion": "<pregunta para verificar comprensión>"
    }
  ]
}`;

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Invalid response type' }, { status: 500 });
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'No JSON found in response' }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (err) {
    console.error('revisar/init error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
