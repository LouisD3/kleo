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
    conceptPages: [
      {
        name: 'La materia está formada por átomos',
        explanation: 'La materia es todo lo que puedes tocar, ver o sentir: tu libro, el agua, el aire. Toda esa materia está formada por partículas increíblemente pequeñas llamadas átomos. Son tan diminutos que millones de ellos caben en el punto final de esta oración.',
        quickCheck: {
          question: '¿De qué están formadas todas las cosas que nos rodean?',
          options: ['De átomos', 'De energía pura'],
          correctIndex: 0,
          hint: 'Los átomos son los bloques de construcción de toda la materia.',
        },
      },
      {
        name: 'Los átomos se unen para formar moléculas',
        explanation: 'Cuando dos o más átomos se unen, forman una molécula. Por ejemplo, el agua (H₂O) es una molécula hecha de 2 átomos de hidrógeno y 1 de oxígeno. Las moléculas son los grupos de átomos que forman las sustancias que conocemos.',
        quickCheck: {
          question: '¿Qué es una molécula?',
          options: ['Dos o más átomos unidos', 'Un átomo muy grande'],
          correctIndex: 0,
          hint: 'Las moléculas se forman cuando varios átomos se enlazan entre sí.',
        },
      },
      {
        name: 'Existen tres estados de la materia: sólido, líquido y gas',
        explanation: 'La materia puede existir en tres estados principales: sólido (tiene forma fija), líquido (toma la forma del recipiente) y gas (se expande para llenar cualquier espacio). El agua es el mejor ejemplo de los tres: hielo, agua y vapor.',
        quickCheck: {
          question: '¿Cuántos estados principales tiene la materia?',
          options: ['Tres: sólido, líquido y gas', 'Dos: sólido y líquido'],
          correctIndex: 0,
          hint: 'Piensa en el agua: puede ser hielo, agua líquida o vapor.',
        },
      },
      {
        name: 'En el estado sólido las partículas están muy juntas y tienen forma fija',
        explanation: 'En un sólido, las partículas están muy juntas y vibran en su lugar sin moverse libremente. Por eso los sólidos tienen forma y volumen fijos: el hielo no cambia de forma a menos que algo lo fuerce a ello.',
        quickCheck: {
          question: '¿Por qué un sólido mantiene su forma?',
          options: ['Porque sus partículas están muy juntas y no se mueven libremente', 'Porque no tiene partículas'],
          correctIndex: 0,
          hint: 'Las partículas del sólido vibran pero no escapan de su lugar.',
        },
      },
      {
        name: 'En el estado líquido las partículas pueden moverse pero el volumen es fijo',
        explanation: 'En un líquido las partículas están cerca pero pueden moverse unas alrededor de otras. Por eso un líquido toma la forma del recipiente que lo contiene, pero su volumen no cambia: un vaso de agua sigue siendo el mismo volumen en cualquier recipiente.',
        quickCheck: {
          question: '¿Qué caracteriza al estado líquido?',
          options: ['Las partículas se mueven pero el volumen es fijo', 'Las partículas están separadas y el volumen cambia'],
          correctIndex: 0,
          hint: 'El agua en un vaso ocupa el mismo volumen aunque cambies de recipiente.',
        },
      },
      {
        name: 'En el estado gaseoso las partículas están muy separadas y en movimiento rápido',
        explanation: 'En un gas las partículas se mueven muy rápido y están muy separadas entre sí. Por eso los gases no tienen forma ni volumen fijos: el aire llena cualquier espacio disponible y puede comprimirse o expandirse fácilmente.',
        quickCheck: {
          question: '¿Cómo son las partículas en un gas?',
          options: ['Muy separadas y en movimiento rápido', 'Muy juntas y sin moverse'],
          correctIndex: 0,
          hint: 'El vapor de agua se expande y llena todo el espacio disponible.',
        },
      },
      {
        name: 'Los cambios de estado ocurren por variaciones de temperatura o presión',
        explanation: 'Cuando cambia la temperatura o la presión, la materia puede cambiar de un estado a otro. Por ejemplo, el hielo se derrite cuando sube la temperatura, y el agua hierve y se convierte en vapor. Estos cambios son físicos: la sustancia sigue siendo la misma.',
        quickCheck: {
          question: '¿Qué provoca que la materia cambie de estado?',
          options: ['Cambios de temperatura o presión', 'Cambios de color o tamaño'],
          correctIndex: 0,
          hint: 'El hielo se derrite con calor (temperatura) y el agua hierve a alta temperatura.',
        },
      },
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
    conceptPages: [
      {
        name: 'Una fuerza es un empuje o jalón que actúa sobre un objeto',
        explanation: 'Una fuerza es cualquier empuje o jalón que actúa sobre un objeto. No puedes ver las fuerzas directamente, pero sí puedes ver sus efectos: mueven objetos, los detienen o cambian su dirección. Abrir una puerta, lanzar una pelota o jalar una mochila son ejemplos de fuerzas.',
        quickCheck: {
          question: '¿Cuál de estas acciones aplica una fuerza?',
          options: ['Empujar una puerta', 'Mirar una ventana'],
          correctIndex: 0,
          hint: 'Una fuerza implica un empuje o un jalón sobre algún objeto.',
        },
      },
      {
        name: 'Las fuerzas se miden en Newtons',
        explanation: 'Las fuerzas se miden en una unidad llamada Newton (N), en honor al científico Isaac Newton. Un Newton es aproximadamente la fuerza que sientes cuando sostienes una manzana pequeña. Los instrumentos que miden fuerzas se llaman dinamómetros.',
        quickCheck: {
          question: '¿En qué unidad se miden las fuerzas?',
          options: ['En Newtons (N)', 'En kilogramos (kg)'],
          correctIndex: 0,
          hint: 'Isaac Newton le dio su nombre a la unidad de fuerza.',
        },
      },
      {
        name: 'La Primera Ley de Newton dice que los objetos en reposo siguen en reposo y los en movimiento siguen en movimiento, a menos que haya una fuerza externa',
        explanation: 'La Primera Ley de Newton establece que un objeto en reposo se queda quieto y un objeto en movimiento sigue moviéndose en línea recta, a menos que una fuerza externa actúe sobre él. Es como si los objetos "no quisieran" cambiar lo que están haciendo.',
        quickCheck: {
          question: 'Según la Primera Ley de Newton, ¿qué le pasa a una pelota rodando en el espacio sin fuerzas?',
          options: ['Sigue rodando para siempre', 'Se detiene sola pronto'],
          correctIndex: 0,
          hint: 'Sin fuerzas externas (como la fricción), nada cambia el movimiento.',
        },
      },
      {
        name: 'La inercia es la resistencia de los objetos al cambio en su movimiento',
        explanation: 'La inercia es la tendencia de los objetos a resistir cambios en su estado de movimiento. Un objeto pesado tiene más inercia que uno ligero: es más difícil ponerlo en movimiento o detenerlo. Por eso en un frenado brusco, tu cuerpo sigue hacia adelante.',
        quickCheck: {
          question: '¿Qué es la inercia?',
          options: ['La resistencia al cambio de movimiento', 'La velocidad máxima de un objeto'],
          correctIndex: 0,
          hint: 'La inercia explica por qué los objetos "no quieren" cambiar su estado.',
        },
      },
      {
        name: 'La gravedad es una fuerza que atrae objetos hacia la Tierra',
        explanation: 'La gravedad es una fuerza de atracción que jala todos los objetos hacia el centro de la Tierra. Por eso cuando sueltas algo, cae hacia abajo. La gravedad también mantiene a la Luna orbitando la Tierra y a la Tierra orbitando el Sol.',
        quickCheck: {
          question: '¿Por qué una manzana cae al suelo cuando la sueltas?',
          options: ['Por la fuerza de gravedad', 'Porque el aire la empuja hacia abajo'],
          correctIndex: 0,
          hint: 'La gravedad es la fuerza que atrae los objetos hacia el centro de la Tierra.',
        },
      },
      {
        name: 'La fricción es una fuerza que se opone al movimiento',
        explanation: 'La fricción es una fuerza que aparece cuando dos superficies están en contacto y se opone al movimiento. Por eso los objetos que ruedan o deslizan eventualmente se detienen. La fricción puede ser útil (frenos de bicicleta) o inconveniente (desgaste de piezas).',
        quickCheck: {
          question: '¿Qué hace la fricción con el movimiento?',
          options: ['Se opone a él y lo frena', 'Lo acelera'],
          correctIndex: 0,
          hint: 'La fricción actúa en sentido contrario al movimiento del objeto.',
        },
      },
      {
        name: 'Las fuerzas pueden sumarse o cancelarse entre sí',
        explanation: 'Cuando varias fuerzas actúan sobre un objeto al mismo tiempo, pueden sumarse (si van en la misma dirección) o cancelarse (si van en direcciones opuestas). Si dos personas empujan una caja con igual fuerza en sentidos contrarios, las fuerzas se cancelan y la caja no se mueve.',
        quickCheck: {
          question: 'Dos personas jalan una cuerda con la misma fuerza en sentidos opuestos. ¿Qué pasa?',
          options: ['Las fuerzas se cancelan y no hay movimiento', 'La cuerda se mueve hacia uno de los lados'],
          correctIndex: 0,
          hint: 'Fuerzas iguales y opuestas se cancelan, resultando en equilibrio.',
        },
      },
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
    conceptPages: [
      {
        name: 'La energía es la capacidad de hacer trabajo o producir un cambio',
        explanation: 'La energía es la capacidad de hacer trabajo o producir un cambio en el mundo. Sin energía, nada podría moverse, calentarse o iluminarse. La comida que comes, la gasolina de los coches y la luz del sol son todas formas de energía.',
        quickCheck: {
          question: '¿Qué es la energía?',
          options: ['La capacidad de hacer trabajo o producir un cambio', 'La velocidad de un objeto'],
          correctIndex: 0,
          hint: 'La energía es lo que permite que las cosas cambien o se muevan.',
        },
      },
      {
        name: 'La energía cinética es la energía del movimiento',
        explanation: 'La energía cinética es la energía que tiene un objeto por estar en movimiento. Cualquier objeto que se mueve, desde una hormiga hasta un tren, tiene energía cinética. Cuando el objeto se detiene, deja de tener energía cinética.',
        quickCheck: {
          question: '¿Cuándo tiene energía cinética un objeto?',
          options: ['Cuando está en movimiento', 'Cuando está en reposo en lo alto de una montaña'],
          correctIndex: 0,
          hint: 'La palabra "cinética" viene del griego y significa "movimiento".',
        },
      },
      {
        name: 'A mayor velocidad o masa, mayor energía cinética',
        explanation: 'La energía cinética aumenta si el objeto va más rápido o si tiene más masa. Un camión a 60 km/h tiene mucha más energía cinética que una bicicleta a la misma velocidad. Y un carro a 100 km/h tiene mucha más que el mismo carro a 20 km/h.',
        quickCheck: {
          question: '¿Qué tiene más energía cinética?',
          options: ['Un camión a 60 km/h', 'Una bicicleta a 60 km/h'],
          correctIndex: 0,
          hint: 'A mayor masa, mayor energía cinética, si la velocidad es la misma.',
        },
      },
      {
        name: 'La energía potencial es energía almacenada por posición o estado',
        explanation: 'La energía potencial es energía almacenada que tiene un objeto por su posición o estado. No está siendo usada en este momento, pero puede convertirse en otro tipo de energía. Una pelota en lo alto de un tobogán o una liga estirada tienen energía potencial.',
        quickCheck: {
          question: '¿Cuál de estos objetos tiene energía potencial?',
          options: ['Una pelota quieta en lo alto de un tobogán', 'Una pelota rodando por el suelo'],
          correctIndex: 0,
          hint: 'La energía potencial está almacenada, lista para usarse.',
        },
      },
      {
        name: 'La energía potencial gravitacional depende de la altura',
        explanation: 'La energía potencial gravitacional es la que tiene un objeto por su altura sobre el suelo. Cuanto más alto está un objeto, mayor es su energía potencial gravitacional. Un libro en la cima de una estantería tiene más energía potencial que el mismo libro en el suelo.',
        quickCheck: {
          question: '¿Qué libro tiene más energía potencial gravitacional?',
          options: ['Uno sobre una estantería alta', 'Uno en el suelo'],
          correctIndex: 0,
          hint: 'A mayor altura, mayor energía potencial gravitacional.',
        },
      },
      {
        name: 'La Ley de Conservación dice que la energía no se crea ni se destruye, solo se transforma',
        explanation: 'La Ley de Conservación de la Energía establece que la energía no se crea ni se destruye, solo cambia de forma. La energía total siempre permanece igual. Cuando enciendes una lámpara, la energía eléctrica se transforma en luz y calor, pero no desaparece.',
        quickCheck: {
          question: '¿Qué le pasa a la energía según la Ley de Conservación?',
          options: ['Se transforma pero nunca desaparece', 'Se destruye cuando se usa'],
          correctIndex: 0,
          hint: 'La energía siempre se conserva, solo cambia de una forma a otra.',
        },
      },
      {
        name: 'La energía puede transformarse de potencial a cinética y viceversa',
        explanation: 'La energía potencial y la cinética se pueden convertir una en otra constantemente. Cuando una pelota cae desde lo alto, su energía potencial se convierte en energía cinética. Cuando una pelota es lanzada hacia arriba, su energía cinética se convierte en potencial.',
        quickCheck: {
          question: '¿Qué pasa con la energía de una pelota cuando cae desde lo alto?',
          options: ['La energía potencial se convierte en cinética', 'La energía cinética se convierte en potencial'],
          correctIndex: 0,
          hint: 'Al caer, la altura disminuye (menos potencial) y la velocidad aumenta (más cinética).',
        },
      },
    ],
  },
];
