import { Cap } from './types';

export const CAPS: Cap[] = [
  {
    id: 1,
    title: 'La Materia',
    subtitle: 'Átomos, moléculas y estados',
    emoji: '⚛️',
    color: 'blue',
    xpReward: 100,
    explanation: `
Todo lo que existe a tu alrededor —el aire, el agua, tu ropa, tú mismo— está hecho de **materia**.

La materia está compuesta por partículas diminutas llamadas **átomos**. Son tan pequeños que millones caben en el punto final de esta oración. Cuando dos o más átomos se unen, forman una **molécula**. Por ejemplo, el agua (H₂O) es una molécula formada por 2 átomos de hidrógeno y 1 de oxígeno.

La materia puede existir en tres **estados**:
- **Sólido**: las partículas están muy juntas y vibran en su lugar. La materia tiene forma y volumen fijos. (Ejemplo: el hielo)
- **Líquido**: las partículas están cerca pero pueden moverse libremente entre ellas. Tiene volumen fijo pero toma la forma del recipiente. (Ejemplo: el agua)
- **Gas**: las partículas se mueven muy rápido y están separadas. No tiene forma ni volumen fijos. (Ejemplo: el vapor de agua)

El cambio de un estado a otro ocurre cuando cambia la **temperatura** o la **presión**.
    `,
    keyConcepts: [
      'La materia está formada por átomos',
      'Los átomos se unen para formar moléculas',
      'Existen tres estados de la materia: sólido, líquido y gas',
      'En el estado sólido las partículas están muy juntas y tienen forma fija',
      'En el estado líquido las partículas pueden moverse pero el volumen es fijo',
      'En el estado gaseoso las partículas están muy separadas y en movimiento rápido',
      'Los cambios de estado ocurren por variaciones de temperatura o presión',
    ],
  },
  {
    id: 2,
    title: 'La Fuerza',
    subtitle: 'Empujes, jales y la ley de Newton',
    emoji: '💪',
    color: 'yellow',
    xpReward: 120,
    explanation: `
Una **fuerza** es cualquier empuje o jalón que actúa sobre un objeto. No puedes ver las fuerzas, pero sí puedes ver sus efectos: mueven objetos, los detienen, cambian su forma o su dirección.

Las fuerzas se miden en **Newtons (N)**, en honor al científico Isaac Newton.

**Primera Ley de Newton (Ley de la Inercia):**
Un objeto en reposo permanecerá en reposo, y un objeto en movimiento seguirá moviéndose en línea recta a velocidad constante, **a menos que una fuerza externa actúe sobre él**.

Esto se llama **inercia**: la tendencia de los objetos a resistirse a cambios en su estado de movimiento.

**Ejemplos de fuerzas en la vida real:**
- Cuando empujas una puerta → aplicas una fuerza
- La **gravedad** jala todo hacia el centro de la Tierra
- La **fricción** es una fuerza que se opone al movimiento (por eso los objetos eventualmente se detienen)
- Un imán atrae clips de metal → fuerza magnética

Las fuerzas pueden **sumarse** (si van en la misma dirección) o **cancelarse** (si van en direcciones opuestas). Cuando las fuerzas se cancelan perfectamente, el objeto queda en equilibrio.
    `,
    keyConcepts: [
      'Una fuerza es un empuje o jalón que actúa sobre un objeto',
      'Las fuerzas se miden en Newtons',
      'La Primera Ley de Newton dice que los objetos en reposo siguen en reposo y los en movimiento siguen en movimiento, a menos que haya una fuerza externa',
      'La inercia es la resistencia de los objetos al cambio en su movimiento',
      'La gravedad es una fuerza que atrae objetos hacia la Tierra',
      'La fricción es una fuerza que se opone al movimiento',
      'Las fuerzas pueden sumarse o cancelarse entre sí',
    ],
  },
  {
    id: 3,
    title: 'La Energía',
    subtitle: 'Cinética, potencial y conservación',
    emoji: '⚡',
    color: 'green',
    xpReward: 150,
    explanation: `
La **energía** es la capacidad de hacer trabajo o producir un cambio. Sin energía, nada en el universo podría suceder: ni el movimiento, ni el calor, ni la luz.

Existen muchas formas de energía. Dos de las más importantes en física son:

**Energía Cinética (Ec):**
Es la energía que tiene un objeto **por estar en movimiento**. Cuanto más rápido se mueve un objeto o cuanto más masa tiene, mayor es su energía cinética.
- Una pelota rodando tiene energía cinética
- Un carro a 100 km/h tiene más energía cinética que a 20 km/h

**Energía Potencial (Ep):**
Es la energía **almacenada** que tiene un objeto por su posición o estado. No está "en uso" en este momento, pero puede convertirse en otro tipo de energía.
- Un libro en la cima de una mesa tiene energía potencial gravitacional
- Una liga estirada tiene energía potencial elástica

**Ley de Conservación de la Energía:**
La energía **no se crea ni se destruye**, solo se **transforma** de una forma a otra. La cantidad total de energía siempre se mantiene constante.

Ejemplo: cuando una pelota rueda por un tobogán, la energía potencial (posición alta) se convierte en energía cinética (movimiento). Al final, la suma siempre es la misma.
    `,
    keyConcepts: [
      'La energía es la capacidad de hacer trabajo o producir un cambio',
      'La energía cinética es la energía del movimiento',
      'A mayor velocidad o masa, mayor energía cinética',
      'La energía potencial es energía almacenada por posición o estado',
      'La energía potencial gravitacional depende de la altura',
      'La Ley de Conservación dice que la energía no se crea ni se destruye, solo se transforma',
      'La energía puede transformarse de potencial a cinética y viceversa',
    ],
  },
];
