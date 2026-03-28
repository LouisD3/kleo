import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic();

export async function POST(req: Request) {
  try {
    const { capTitle, concept, targetedQuestion, studentAnswer, aiExplanation } =
      await req.json() as {
        capTitle: string;
        concept: string;
        targetedQuestion: string;
        studentAnswer: string;
        aiExplanation: string;
      };

    const prompt = `Eres un tutor de física para estudiantes de 10 a 14 años, evaluando una respuesta sobre "${capTitle}".

Concepto evaluado: "${concept}"
Explicación que recibió el estudiante: "${aiExplanation}"
Pregunta: "${targetedQuestion}"
Respuesta del estudiante: "${studentAnswer}"

Evalúa si la respuesta demuestra comprensión correcta del concepto. Sé generoso: si la idea central es correcta aunque no sea perfecta o completa, considérala correcta.

Si es incorrecta, genera UNA nueva pregunta más sencilla sobre el mismo concepto para darle otra oportunidad al estudiante.

Responde ÚNICAMENTE con JSON válido, sin texto adicional:
{
  "correct": <true o false>,
  "feedback": "<retroalimentación breve y alentadora, máximo 2 oraciones>",
  "newQuestion": <"nueva pregunta más sencilla" | null>
}

Si correct es true, newQuestion debe ser null.`;

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
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
    console.error('revisar/check error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
