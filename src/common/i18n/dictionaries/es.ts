const overweightCompanies = (count: number) =>
  count === 1 ? "la empresa que pesa de más" : `las ${count} empresas que pesan de más`;

const underweightCompanies = (count: number) =>
  count === 1 ? "la que pesa de menos" : `las ${count} que pesan de menos`;

type RebalanceSummaryInput = { soldAmount: string; sellCount: number; buyCount: number };

export const es = {
  metadata: {
    title: "Portafolio Martín Santiago",
    description: "Qué acciones comprar y vender para que tu portafolio vuelva a su asignación objetivo.",
  },
  site: {
    name: "Portafolio Martín Santiago",
    localeSwitcherLabel: "Idioma",
    repository: "GitHub",
  },
  hero: {
    title: "Hola, soy Martín",
    introduction:
      "Soy Martín Pérez, Ingeniero Industrial en Computación PUC, aficionado a la música, videojuegos y finanzas. Mi portafolio mezcla big tech con las compañías detrás de los juegos que más disfruto. Creé este sitio para que la IA me recomiende qué vender y qué comprar para mantener la distribución que me propuse.",
    totalValue: (amount: string) => `Valor total ${amount}`,
    closeOf: (closeDate: string) => `Cierre del ${closeDate}`,
    editTarget: "Editar objetivo",
    samplePrices: "Precios de ejemplo",
    onTarget: "Hoy mi portafolio calza con la distribución que me propuse.",
    rebalanceSummary: ({ soldAmount, sellCount, buyCount }: RebalanceSummaryInput) =>
      `Hoy mi portafolio no calza con la distribución que me propuse como objetivo. Para corregirlo, debo vender ${soldAmount} de ${overweightCompanies(sellCount)} y con esa misma plata compro ${underweightCompanies(buyCount)}. No entrará ni saldrá dinero: solo cambia el reparto del balance.`,
  },
  info: {
    label: "Qué significa",
    shares:
      "Cuántas acciones tienes. En este demo vienen fijas del portafolio de ejemplo; en una app real vendrían de tu cuenta en el broker.",
    current:
      "El peso que tiene hoy la acción en tu portafolio: acciones × precio de cierre, dividido por el valor total. Ej.: 10 acciones × US$600 = US$6.000 de US$30.000 → 20%. Cambia solo cuando se mueven los precios.",
    target: "El peso que quieres para la acción. Lo defines en «Editar objetivo» o usas el de ejemplo. Entre todas suman 100%.",
    drift:
      "Actual menos objetivo, en puntos porcentuales (pp). Positivo en rojo: sobra, hay que vender. Negativo en verde: falta, hay que comprar.",
    example: "El reparto de ejemplo que trae la app: 60% en big tech y 40% en videojuegos.",
    yourTarget: "El porcentaje que quieres en cada acción. Usa 0% para no tenerla. El total tiene que sumar 100%.",
    allocationSection:
      "Compara cómo está repartida tu plata hoy (barra Actual) contra el reparto que te propusiste (barra Objetivo). Cada color es una acción y su ancho es su % del total. Si los bloques no calzan entre una barra y otra, el portafolio se desvió: eso es lo que corrigen las órdenes.",
    ordersSection:
      "El resultado del rebalanceo. Para cada acción se compara su valor actual con su valor objetivo (valor total × % objetivo) y se compra o vende la diferencia, permitiendo fracciones de acción. Lo que vendes paga exactamente lo que compras, así que el total no cambia. Van de mayor a menor monto.",
    positionsSection:
      "El detalle por acción: precio de cierre, cuántas acciones tienes, cuánto valen y su peso actual contra el objetivo. El desvío dice cuánto se alejó en puntos porcentuales, y la pista lo dibuja: el marcador negro es el actual, el hueco es el objetivo y el tramo de color es la distancia.",
  },
  targetEditor: {
    title: "Define tu objetivo",
    lead: "¿Cómo quieres repartir tu plata? Pon el porcentaje que quieres en cada acción; tienen que sumar 100%. Al guardarlo, el plan de rebalanceo se recalcula con tu objetivo.",
    stock: "Acción",
    example: "Ejemplo",
    target: "Tu objetivo",
    total: "Total",
    complete: "Suma 100%, listo.",
    missing: "Faltan {percentage} para llegar a 100%.",
    excess: "Sobran {percentage}: baja algún valor hasta llegar a 100%.",
    save: "Usar este objetivo",
    saving: "Guardando…",
    useExample: "Usar el de ejemplo",
    invalid: "El objetivo tiene que sumar 100% y cada valor estar entre 0 y 100.",
  },
  allocation: {
    title: "Asignación (Allocation).",
    subtitle: "Cómo está repartida mi cartera hoy contra cómo debería estar.",
    current: "Actual",
    target: "Objetivo",
  },
  calculation: {
    title: "Cómo se calcula.",
    subtitle: "Los cuatro pasos que sigue el rebalanceo para cada acción.",
    selectorLabel: "Ver el cálculo de",
    totalStep: "Valor total",
    totalStepDescription: "Suma de acciones × precio de cierre de todas las empresas.",
    totalFormula: "Σ acciones × precio",
    targetStep: "Valor objetivo",
    targetStepDescription: "Cuánto debería valer esta acción: valor total × su % objetivo.",
    gapStep: "Diferencia",
    gapStepDescription: "Valor objetivo menos valor actual (acciones × precio).",
    sharesStep: "Acciones a operar",
    sharesStepDescription: "La diferencia dividida por el precio de la acción.",
    excess: "sobra, hay que vender",
    shortfall: "falta, hay que comprar",
    onTarget: "en objetivo, sin orden",
    tableCaption: "Cada acción con su valor actual, su valor objetivo, la diferencia y la orden que resulta",
    stock: "Acción",
    currentValue: "Valor actual",
    targetValue: "Valor objetivo",
    gap: "Diferencia",
    price: "Precio",
    order: "Orden",
    sold: "Vendes",
    bought: "Compras",
  },
  orders: {
    title: "Órdenes.",
    subtitle: "Las posiciones que hay que vender y comprar para volver al objetivo.",
    buy: "Comprar",
    sell: "Vender",
    sellAll: "Vender todo",
    shareUnit: "acc.",
    empty: "No hay órdenes pendientes.",
    sellGroup: "Vender",
    buyGroup: "Comprar",
    sellGroupHint: (count: number) => (count === 1 ? "1 empresa pesa de más" : `${count} empresas pesan de más`),
    buyGroupHint: (count: number) => (count === 1 ? "1 empresa pesa de menos" : `${count} empresas pesan de menos`),
  },
  positions: {
    title: "Posiciones.",
    subtitle: "Precio, cantidad y cuánto se aleja cada acción de su objetivo.",
    caption: "Cada acción con su precio, cantidad, valor y asignación actual contra la objetivo",
    stock: "Acción",
    price: "Precio",
    shares: "Cantidad",
    value: "Valor",
    current: "Actual",
    target: "Objetivo",
    drift: "Desvío",
  },
  advice: {
    title: "Consejos de Claude.",
    subtitle: "Una segunda opinión sobre cada orden.",
    request: "Pedir consejos",
    requesting: "Pidiendo consejos…",
    agreesWithOrder: "De acuerdo con la orden",
    disagreesWithOrder: "En desacuerdo con la orden",
    stances: { add: "Aumentar", hold: "Mantener", trim: "Reducir" },
    errors: {
      disabled: "Los consejos están desactivados aquí. Configura ANTHROPIC_API_KEY para activarlos.",
      "advice-failed": "No se pudieron generar los consejos. Intenta de nuevo en un minuto.",
      "prices-unavailable": "Faltan precios, así que todavía no hay nada que revisar.",
    },
  },
  onboarding: {
    restart: "Ver guía",
    skip: "Saltar guía",
    next: "Siguiente",
    previous: "Anterior",
    done: "Listo",
    progress: "{{current}} de {{total}}",
    steps: {
      welcome: {
        title: "Bienvenido a mi portafolio",
        description: "Acá sigo mis inversiones y reviso qué ajustar. Este es el onboarding, puedes saltarlo si quieres :).",
      },
      allocation: {
        title: "Cómo está repartido",
        description: "Cada color es una acción. Arriba, cómo está repartido hoy; abajo, la distribución a la que apunto.",
      },
      calculation: {
        title: "Cómo se calcula",
        description:
          "Elige una acción y sigue los cuatro pasos del rebalanceo con sus números reales: valor total, valor objetivo, diferencia y acciones a operar. Abajo, la misma cuenta para todas.",
      },
      orders: {
        title: "Qué vender y qué comprar",
        description: "Por un lado lo que vendo y por otro lo que compro, cada lado de la orden más grande a la más chica. Lo que vendo paga exactamente lo que compro.",
      },
      drift: {
        title: "Qué tan lejos está cada acción",
        description:
          "El desvío es el peso actual menos el objetivo. Ejemplo: 20% actual con objetivo 15% da +5 pp en rojo: sobra, hay que vender. 5% con objetivo 10% da -5 pp en verde: falta, hay que comprar.",
      },
      advice: {
        title: "Una segunda opinión",
        description: "Claude revisa cada orden y dice si está de acuerdo. Tarda unos segundos.",
      },
      target: {
        title: "Prueba tu propio objetivo",
        description: "Este es el reparto que yo elegí, pero puedes poner el tuyo: cambia los porcentajes y todo el plan se recalcula.",
      },
    },
  },
  footer: {
    marketstack: "Precios de cierre diarios de la API de Marketstack.",
    sample: "Precios de ejemplo. Configura MARKETSTACK_API_KEY para usar precios reales.",
    "sample-fallback": "Marketstack no está entregando precios ahora, así que muestro precios de ejemplo.",
  },
  pricesUnavailable: {
    heading: (symbols: string) => `Sin precio para ${symbols}`,
    body: "El plan de rebalanceo necesita el precio actual de cada acción. Revisa que MARKETSTACK_API_KEY sea válida y vuelve a cargar los precios.",
    reload: "Recargar precios",
  },
  loading: "Cargando precios",
};

export type Dictionary = typeof es;
