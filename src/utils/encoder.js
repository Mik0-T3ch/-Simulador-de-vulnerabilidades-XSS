export function toHtmlEntitiesDecimal(str) {
  return str.split('').map(c => `&#${c.charCodeAt(0)};`).join('');
}

export function toHtmlEntitiesHex(str) {
  return str.split('').map(c => `&#x${c.charCodeAt(0).toString(16)};`).join('');
}

export function toUrlEncode(str) {
  return encodeURIComponent(str);
}

export function toDoubleUrlEncode(str) {
  return encodeURIComponent(encodeURIComponent(str));
}

export function toUnicodeEscape(str) {
  return str.split('').map(c => {
    const hex = c.charCodeAt(0).toString(16).padStart(4, '0');
    return `\\u${hex}`;
  }).join('');
}

export function toBase64(str) {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    return '';
  }
}

export function toBase64DataUri(str) {
  const b64 = toBase64(str);
  return `data:text/html;base64,${b64}`;
}

export function toJsCharCode(str) {
  const codes = str.split('').map(c => c.charCodeAt(0)).join(',');
  return `String.fromCharCode(${codes})`;
}

export function toHex(str) {
  return str.split('').map(c => `\\x${c.charCodeAt(0).toString(16).padStart(2, '0')}`).join('');
}

export function testFilterBypass(payload, filterType) {
  const normalized = payload || '';
  
  if (filterType === 'simple_script') {
    const blocked = /<script.*?>.*?<\/script>/is.test(normalized);
    const sanitized = normalized.replace(/<script.*?>.*?<\/script>/gis, '');
    return {
      name: 'Filtro básico de <script>',
      blocked,
      sanitized,
      bypassed: !blocked && (/<[a-z]|on\w+=/i.test(normalized) || normalized.includes('javascript:'))
    };
  }

  if (filterType === 'case_sensitive') {
    const blocked = normalized.includes('<script>');
    const sanitized = normalized.replace('<script>', '');
    return {
      name: 'Filtro Case-Sensitive (<script>)',
      blocked,
      sanitized,
      bypassed: /<script/i.test(normalized) && !blocked
    };
  }

  if (filterType === 'no_quotes') {
    const blocked = /['"]/.test(normalized);
    return {
      name: 'Bloqueo de comillas simples y dobles',
      blocked,
      sanitized: normalized.replace(/['"]/g, ''),
      bypassed: !blocked && (normalized.includes('String.fromCharCode') || normalized.includes('`') || /on\w+=/i.test(normalized))
    };
  }

  if (filterType === 'no_alert') {
    const blocked = /alert\s*\(/i.test(normalized);
    return {
      name: 'Bloqueo de palabra alert()',
      blocked,
      sanitized: normalized.replace(/alert/gi, ''),
      bypassed: !blocked && (normalized.includes('prompt') || normalized.includes('confirm') || normalized.includes('top[') || normalized.includes('window['))
    };
  }

  return {
    name: 'Sin filtro',
    blocked: false,
    sanitized: normalized,
    bypassed: true
  };
}
