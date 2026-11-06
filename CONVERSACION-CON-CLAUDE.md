# Conversación con Claude

Construí este desafío conversando con Claude Code (modelo Claude Opus 5.5) en una sola sesión larga. Acá dejo los puntos clave: qué pedí, qué decidimos y qué corregimos en el camino.

## 1. El pedido inicial

Le pedí un proyecto Next.js con arquitectura hexagonal para seguir mis inversiones: big tech y empresas de videojuegos. Los requisitos eran:

- Cada acción con un método de precio actual.
- Un portafolio con su reparto objetivo y un método de rebalanceo.
- Un agente que diera consejos básicos.
- Precios desde una API oficial.
- Código limpio y repo público en mi GitHub.
- Flujos simples antes que una interfaz compleja.

Antes de escribir código le pedí iterar el plan haciéndome preguntas.

## 2. Decisiones del plan

| Tema | Decisión |
|---|---|
| Propósito | Desafío de Fintual: primero el dominio y sus tests, la interfaz después |
| Datos | Las posiciones y el objetivo viven en un archivo del repo, detrás de un repositorio |
| Precios | Partimos con Finnhub. Claude notó que mi key era de Marketstack (Finnhub respondía 401) y cambiamos a Marketstack |
| Sin key | Precios de ejemplo, para que cualquiera lo corra sin configurar nada |
| Agente | Pedí un LLM gratis tipo DeepSeek. Terminé usando el SDK de Anthropic, con la key solo en producción |
| Interacción | Un botón de consejo que llama a una Server Action |
| Qué ve Claude | La empresa y también el plan, para que no contradiga una orden sin decirlo |
| Rebalanceo | Con fracciones de acción y sin depositar plata nueva |
| Casos borde | Roblox está en el objetivo sin tenerla (compra desde cero) y Unity la tengo sin estar en el objetivo (venta total) |
| Estilo | Limpio y sobrio |
| Repo | Público, con commits sin co-autoría de Claude |
| Deploy | Vercel |

## 3. Cómo fue creciendo la app

1. **Diseño y nombre:** diseño inspirado en la página de datos de opencode y el nombre «Portafolio Martín Santiago».
2. **Revisar el enunciado:** confirmamos que `Stock.currentPrice()`, las acciones «allocated» y `rebalance()` estuvieran en el dominio y no en la interfaz.
3. **Guía con driver.js:** pocos pasos, se reinicia al recargar y tiene botones para salir y para reiniciarla. También le di al inicio un texto más personal.
4. **Idiomas:** ajusté los textos en español y Claude los pasó al diccionario en inglés.
5. **Claude de verdad:** verificamos que el botón llamara al modelo y no a una respuesta fija.
6. **Posiciones más claras:** no se entendía cada fila, así que agregamos una leyenda, las columnas actual/objetivo/distancia y un paso de la guía con un ejemplo.
7. **Entender el objetivo:** pregunté de dónde salían el reparto «actual» y el «objetivo».
   - El actual es acciones × precio.
   - El objetivo es el reparto que yo elijo.
   - Agregamos una pantalla para definirlo, con la opción de usar el de ejemplo. Se guarda en una cookie.
8. **Explicaciones:** botones (i) en las columnas clave, ayudas en asignación, órdenes y posiciones, y el logo como favicon.
9. **Mostrar el proceso:** sentía que el rebalanceo estaba pero no se veía. Agregamos la sección «Cómo se calcula».
   - Eliges una acción y ves los cuatro pasos: valor total, valor objetivo, diferencia y acciones a mover.
   - Una tabla los aplica a todas las acciones y muestra que lo vendido es igual a lo comprado.
10. **Streaming:** el consejo de Claude aparece mientras lo escribe.
11. **Guía completa:** sumamos el paso del cálculo a la guía.
12. **Producción:** deploy en Vercel desde `main`.
13. **Ajustes finales:**
    - Reescribí el README como mi razonamiento, con el diagrama de conexiones.
    - Sacamos el paso obligatorio del objetivo: ahora se llega directo al dashboard y se destaca que el objetivo se puede editar.

## 4. Revisión final

Le pedí una revisión completa con máximo esfuerzo: arquitectura hexagonal, bugs y buenas prácticas. Claude repartió la revisión entre varios agentes y verificó cada hallazgo antes de corregirlo.

Bugs encontrados y corregidos, entre otros:

- Pedir un segundo consejo tumbaba el dashboard.
- Apretar Enter en el editor borraba el objetivo.
- El editor aceptaba un total de 99,99%.
- La guía reaparecía al navegar.
- Las ayudas (i) no abrían con un toque en el celular.
- El selector de idioma te sacaba de la página donde estabas.
- La librería de validación (zod) llegaba al navegador sin necesidad.

Ya en producción, Marketstack respondió 429 porque se acabó la cuota gratis de 100 llamadas al mes. Ahora la app usa precios de ejemplo cuando eso pasa y lo avisa en el pie.

Al cierre pasaban el typecheck, el lint, los 25 tests y el build.

## 5. Cómo trabajé con Claude

- **Primero el plan, después el código:** las decisiones importantes las tomé yo, respondiendo preguntas concretas.
- **Pruebas en el navegador:** Claude probaba cada cambio en Chrome, en escritorio y en celular.
- **Commits:** durante el desarrollo fueron por capa. Al final ordené el historial en 12 commits, uno por feature.
- **Preguntar cuando algo no calza:** cuando no entendía algo (qué es el objetivo, cómo se ve el rebalanceo) lo pregunté en vez de seguir de largo, y eso mejoró la app.
