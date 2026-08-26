export function analyzePayload(payload) {
  if (!payload || typeof payload !== 'string') {
    return {
      isValid: false,
      severity: 'Low',
      cvssScore: 0.0,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N',
      vectors: [],
      contexts: [],
      riskLevel: 'Informativo',
      cwe: 'CWE-79: Improper Neutralization of Input During Web Page Generation',
      owasp: 'A03:2021 - Injection',
      remediation: 'Sanitizar y codificar todas las entradas de usuario.',
      details: []
    };
  }

  const raw = payload.trim();
  const lower = raw.toLowerCase();
  const vectors = [];
  const contexts = [];
  const details = [];

  let isScriptTag = false;
  let isEventHandler = false;
  let isPseudoProtocol = false;
  let isSvgVector = false;
  let isIframeVector = false;
  let isDomSink = false;
  let isPolyglot = false;
  let isEncoded = false;

  if (/<script[\s>]/i.test(raw)) {
    isScriptTag = true;
    vectors.push('Script Tag Injection (<script>)');
    contexts.push('HTML Body Context');
    details.push('Uso directo de etiquetas de script ejecutables en el DOM.');
  }

  const eventRegex = /on(load|error|click|focus|mouseover|mouseenter|mouseleave|change|blur|submit|keydown|keyup|keypress|pointerdown|pointerover|animationend|toggle|wheel)\s*=/i;
  if (eventRegex.test(raw)) {
    isEventHandler = true;
    const match = raw.match(eventRegex);
    vectors.push(`Inline Event Handler (${match ? match[0].replace('=', '') : 'DOM Event'})`);
    contexts.push('HTML Attribute Context');
    details.push('Inyección de controladores de eventos inline en etiquetas HTML.');
  }

  if (/javascript\s*:/i.test(raw) || /data\s*:\s*text\/html/i.test(raw) || /vbscript\s*:/i.test(raw)) {
    isPseudoProtocol = true;
    vectors.push('URI Scheme Execution (javascript: / data:)');
    contexts.push('URL / Attribute Context (href, src, formaction)');
    details.push('Ejecución de código a través de esquemas de pseudo-protocolo en atributos navegables.');
  }

  if (/<svg[\s>]/i.test(raw)) {
    isSvgVector = true;
    vectors.push('SVG / XML Vector Injection');
    contexts.push('SVG / XML Context');
    details.push('Aprovechamiento del parser XML/SVG para disparar eventos sin necesidad de tags estándar.');
  }

  if (/<(iframe|object|embed|applet)[\s>]/i.test(raw)) {
    isIframeVector = true;
    vectors.push('Embedded Object Injection (iframe / embed / object)');
    contexts.push('Nested Document Context');
    details.push('Incrustación de objetos o marcos secundarios para aislar o cargar contenido externo ejecutable.');
  }

  if (/(document\.cookie|window\.localStorage|sessionStorage|location\.href|document\.location|window\.name|document\.write|innerHTML|outerHTML)/i.test(raw)) {
    isDomSink = true;
    vectors.push('DOM Sink / Source Manipulation');
    details.push('Acceso a sumideros o fuentes críticas del DOM (cookies, almacenamiento local o navegación).');
  }

  if (/%[0-9a-fA-F]{2}|&#x?[0-9a-zA-Z]+;|\\u00[0-9a-fA-F]{2}/i.test(raw)) {
    isEncoded = true;
    vectors.push('Obfuscated / Encoded Payload');
    details.push('Contiene caracteres codificados en Hexadecimal, HTML entities o Unicode para evadir filtros.');
  }

  if ((raw.includes('jaVasCript:') || raw.includes('<!--') || raw.includes('-->') || raw.includes('/*') || raw.includes('*/')) && (isScriptTag || isEventHandler)) {
    isPolyglot = true;
    vectors.push('Polyglot / Filter Bypass Structure');
    details.push('Estructura políglota diseñada para ejecutarse en múltiples contextos simultáneamente.');
  }

  let cvssScore = 6.1;
  let severity = 'Medium';
  let cvssVector = 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N';

  const totalThreats = (isScriptTag ? 2 : 0) + (isEventHandler ? 2 : 0) + (isPseudoProtocol ? 2 : 0) + (isDomSink ? 2 : 0) + (isPolyglot ? 1 : 0) + (isSvgVector ? 1 : 0);

  if (raw.includes('document.cookie') || raw.includes('localStorage') || raw.includes('fetch(') || raw.includes('XMLHttpRequest')) {
    cvssScore = 8.8;
    severity = 'High';
    cvssVector = 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:N';
  } else if (totalThreats >= 4) {
    cvssScore = 7.5;
    severity = 'High';
    cvssVector = 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:H/A:N';
  } else if (totalThreats >= 2) {
    cvssScore = 6.1;
    severity = 'Medium';
    cvssVector = 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N';
  } else if (totalThreats === 1 || raw.length > 0) {
    cvssScore = 4.3;
    severity = 'Low';
    cvssVector = 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:N/A:N';
  } else {
    cvssScore = 0.0;
    severity = 'Safe';
    cvssVector = 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N';
  }

  let remediation = '';
  if (isScriptTag || isEventHandler || isSvgVector) {
    remediation = 'Implementar Context-Aware Output Encoding (codificación HTML de entidades como &, <, >, ", \') antes de renderizar entradas del usuario. Establecer una política de seguridad de contenido (CSP) con script-src estricto evitando unsafe-inline.';
  } else if (isPseudoProtocol) {
    remediation = 'Validar y aplicar listas blancas a todos los enlaces y URIs aceptando únicamente esquemas http:// y https://. Rechazar terminantemente javascript:, data: y vbscript:.';
  } else {
    remediation = 'Aplicar validación estricta de formato, sanitización con bibliotecas reconocidas como DOMPurify y protección de cookies de sesión con el atributo HttpOnly.';
  }

  return {
    isValid: vectors.length > 0,
    severity,
    cvssScore,
    cvssVector,
    vectors: vectors.length > 0 ? vectors : ['Texto sin vector XSS evidente'],
    contexts: contexts.length > 0 ? contexts : ['HTML General'],
    details,
    cwe: 'CWE-79: Neutralización incorrecta de entradas durante la generación de páginas web (Cross-site Scripting)',
    owasp: 'A03:2021 - Injection',
    remediation
  };
}
