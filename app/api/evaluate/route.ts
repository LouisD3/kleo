import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Eres un evaluador estricto y tutor amigable de física para estudiantes jóvenes (10-14 años).

Recibirás:
- El tema estudiado
- Los conceptos clave numerados
- La explicación escrita por el estudiante

Tu tarea es evaluar CADA concepto individualmente y devolver un JSON con este formato exacto (sin texto adicional, solo el JSON):
{
  "conceptChecks": [
    {
      "concept": "nombre exacto del concepto tal como aparece en la lista",
      "covered": true/false,
      "studentEvidence": "cita breve o paráfrasis de lo que dijo el estudiante que demuestra esto (solo si covered=true)"
    }
  ],
  "correct": ["descripción específica de lo que el estudiante explicó correctamente", ...],
  "gaps": ["descripción específica del concepto que faltó o fue incorrecto", ...],
  "passed": true/false,
  "followUpQuestions": ["pregunta dirigida a un concepto no cubierto", ...],
  "tutorExplanation": "explicación del tutor si passed=false, vacío si passed=true"
}

REGLAS DE EVALUACIÓN (no negociables):

1. CONCEPTO POR CONCEPTO: Evalúa cada concepto de la lista en orden. Para cada uno, decide BINARIAMENTE: covered=true o covered=false. No hay término medio.

2. CRITERIO DE APROBACIÓN: "passed" = true ÚNICAMENTE si el número de conceptos con covered=true es ≥ 6 cuando hay 7 conceptos (o ≥ ceil(N*6/7) para N conceptos). Cuenta los covered=true en conceptChecks y aplica la regla aritmética.

3. COBERTURA REAL: Un concepto está cubierto solo si el estudiante demostró comprensión genuina. Mencionar la palabra no es suficiente — debe mostrar que entiende qué es o cómo funciona.

4. GAPS ESPECÍFICOS: En "gaps", NO digas "te faltó la energía potencial". Di "No explicaste que la energía potencial gravitacional depende de la altura del objeto".

5. PREGUNTAS DE SEGUIMIENTO: Máximo 2 preguntas. Cada una debe apuntar directamente a un concepto con covered=false. Si passed=true, followUpQuestions debe ser [].

6. tutorExplanation: Si passed=false, escribe 2-3 frases por CADA concepto no cubierto explicando ese concepto con analogías concretas y lenguaje sencillo (10-14 años). Usa formato markdown con listas. Si passed=true, deja tutorExplanation como string vacío "".

7. TONO: Siempre amable, alentador, como un buen amigo mayor. Nunca uses lenguaje negativo o desalentador.

8. Todo el contenido debe estar en español.

9. conceptChecks debe tener EXACTAMENTE el mismo número de elementos que la lista de conceptos clave recibida, en el mismo orden.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { capTitle, keyConcepts, userExplanation, phase, questions, answers, gaps } = body;

    let userMessage: string;

    if (phase === 'initial') {
      userMessage = `Tema: ${capTitle}

Conceptos clave que el estudiante debería haber aprendido (evalúa CADA UNO en orden):
${keyConcepts.map((c: string, i: number) => `${i + 1}. ${c}`).join('\n')}

Explicación del estudiante (con sus propias palabras):
"${userExplanation}"

Evalúa cada concepto individualmente. Recuerda: conceptChecks debe tener exactamente ${keyConcepts.length} elementos.`;
    } else {
      // Follow-up phase: strict evaluation, include known gaps
      const gapList = gaps && gaps.length > 0
        ? `\nConceptos que el estudiante NO había cubierto en el intento anterior:\n${gaps.map((g: string, i: number) => `- ${g}`).join('\n')}`
        : '';

      userMessage = `Tema: ${capTitle}

Conceptos clave del tema (evalúa CADA UNO en orden):
${keyConcepts.map((c: string, i: number) => `${i + 1}. ${c}`).join('\n')}
${gapList}

El estudiante respondió preguntas de seguimiento sobre los conceptos que le faltaban:
${questions.map((q: string, i: number) => `Pregunta: ${q}\nRespuesta del estudiante: "${answers[i]}"`).join('\n\n')}

Evalúa ESTRICTAMENTE si las respuestas demuestran comprensión real de los conceptos que faltaban. Aplica el mismo criterio riguroso: un concepto está cubierto solo si el estudiante demuestra que entiende qué es o cómo funciona, no solo si menciona la palabra. Recuerda: conceptChecks debe tener exactamente ${keyConcepts.length} elementos.`;
    }

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Extract JSON from the response (handle potential markdown code blocks)
    let jsonText = content.text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    }

    const result = JSON.parse(jsonText);

    // Guard: conceptChecks must be present and match keyConcepts length
    if (!result.conceptChecks || result.conceptChecks.length !== keyConcepts.length) {
      console.error('conceptChecks missing or wrong length', result.conceptChecks?.length, keyConcepts.length);
      return NextResponse.json(
        { error: 'Error interno de evaluación. Por favor intenta de nuevo.' },
        { status: 500 }
      );
    }

    // Safety assertion: recalculate passed from conceptChecks to prevent Claude contradictions
    const coveredCount = result.conceptChecks.filter((c: { covered: boolean }) => c.covered).length;
    const threshold = Math.ceil(keyConcepts.length * 6 / 7);
    if (result.passed !== (coveredCount >= threshold)) {
      result.passed = coveredCount >= threshold;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Evaluation error:', error);
    return NextResponse.json(
      { error: 'Error al evaluar la respuesta. Por favor intenta de nuevo.' },
      { status: 500 }
    );
  }
}
