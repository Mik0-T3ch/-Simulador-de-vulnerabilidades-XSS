export const PRESET_POLICIES = {
  insecure: {
    name: 'Insegura (Default Permisivo)',
    policy: "default-src *; script-src * 'unsafe-inline' 'unsafe-eval'",
    description: 'Permite la ejecución de scripts en línea, cadenas eval() y fuentes remotas arbitrarias.'
  },
  basic: {
    name: 'Básica con Self',
    policy: "default-src 'self'; script-src 'self' 'unsafe-inline'",
    description: 'Restringe orígenes externos pero deja abierta la puerta a inyecciones inline.'
  },
  strict_nonce: {
    name: 'Estricta con Nonce (Recomendada OWASP)',
    policy: "default-src 'self'; script-src 'nonce-r4nd0mN0nc3' 'strict-dynamic'; object-src 'none'; base-uri 'none'",
    description: 'Solo scripts con el atributo nonce criptográfico válido pueden ejecutarse.'
  },
  google_recommended: {
    name: 'Google Strict CSP',
    policy: "object-src 'none'; script-src 'nonce-edg3Xss' 'unsafe-inline' https: 'strict-dynamic'; base-uri 'none'",
    description: 'Política moderna que aprovecha strict-dynamic para bloquear scripts inyectados.'
  }
};

export function evaluateCspAgainstPayload(policyString, payload) {
  if (!policyString) {
    return {
      allowed: true,
      reason: 'No hay política CSP configurada. El payload se ejecutará sin restricciones.',
      violationType: null
    };
  }

  const normalizedPolicy = policyString.toLowerCase();
  const raw = payload || '';

  const hasUnsafeInline = normalizedPolicy.includes("'unsafe-inline'");
  const hasNonce = /'nonce-[a-zA-Z0-9+/=_-]+'/.test(normalizedPolicy);
  const hasStrictDynamic = normalizedPolicy.includes("'strict-dynamic'");
  const hasObjectNone = normalizedPolicy.includes("object-src 'none'");

  const isInlineScript = /<script[\s>]/i.test(raw) && !/nonce=/i.test(raw);
  const isInlineEvent = /on\w+\s*=/i.test(raw);
  const isJavascriptUri = /href\s*=\s*['"]?javascript:/i.test(raw);
  const isObjectTag = /<(object|embed|applet)[\s>]/i.test(raw);

  if (isObjectTag && hasObjectNone) {
    return {
      allowed: false,
      reason: "Bloqueado por la directiva object-src 'none'. Los plugins e incrustaciones están deshabilitados.",
      violationType: 'object-src'
    };
  }

  if (isInlineEvent && (!hasUnsafeInline || hasStrictDynamic)) {
    return {
      allowed: false,
      reason: "Bloqueado: Los inline event handlers (onerror, onload, onclick) son rechazados bajo directivas CSP modernas sin 'unsafe-inline'.",
      violationType: 'script-src (inline-event)'
    };
  }

  if (isJavascriptUri && !hasUnsafeInline) {
    return {
      allowed: false,
      reason: "Bloqueado: La navegación a esquemas 'javascript:' es bloqueada por la directiva script-src.",
      violationType: 'script-src (javascript-scheme)'
    };
  }

  if (isInlineScript) {
    if (hasNonce && !raw.includes('nonce=')) {
      return {
        allowed: false,
        reason: 'Bloqueado: La etiqueta <script> no posee el token nonce exigido por la política.',
        violationType: 'script-src (nonce-missing)'
      };
    }
    if (!hasUnsafeInline) {
      return {
        allowed: false,
        reason: "Bloqueado: Se intentó ejecutar un script inline sin la directiva 'unsafe-inline'.",
        violationType: 'script-src (inline)'
      };
    }
  }

  return {
    allowed: true,
    reason: 'El payload fue permitido por la configuración actual de CSP.',
    violationType: null
  };
}
