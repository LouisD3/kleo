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
Explicación de referencia: "${aiExplanation}"
Pregunta hecha al estudiante: "${targetedQuestion}"
Respuesta del estudiante: "${studentAnswer}"

Evalúa si la respuesta demuestra comprensión correcta del concepto. Sé generoso: si la idea central es correcta aunque no sea perfecta o completa, considérala correcta.

Escribe exactamente 2 o 3 puntos cortos que:
- El primero reaccione a la respuesta del estudiante de forma alentadora y positiva (nunca negativa)
- Los siguientes expliquen o refuercen el concepto usando una analogía cotidiana
- Si es incorrecta: guíen al estudiante sin revelar la respuesta directamente
- Si es correcta: confirmen y profundicen un poco la comprensión
- Cada punto debe ser una sola oración, corta y clara, para estudiantes de 10-14 años

Si es incorrecta, genera también UNA nueva pregunta más sencilla sobre el mismo concepto.

Responde ÚNICAMENTE con JSON válido, sin texto adicional:
{
  "correct": <true o false>,
  "message": ["<punto 1>", "<punto 2>", "<punto 3 opcional>"],
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
