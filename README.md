# Simulador de Vulnerabilidades XSS & Sistema de Reportes

Plataforma interactiva para la simulación, análisis, evasión y mitigación de vulnerabilidades Cross-Site Scripting (XSS), diseñada para formación en ciberseguridad, pruebas de concepto y generación de reportes de auditoría técnica.

---

## Modulos Principales

### 1. Dashboard de Seguridad
* Metricas de simulaciones en tiempo real.
* Registro de auditoria e historial de ejecuciones.
* Estado del entorno victima y contexto de sesion.

### 2. Laboratorios Interactivos
* **Reflected XSS:** Simulador de busqueda con parametros URL y niveles de seguridad (Bajo, Medio, Alto).
* **Stored XSS:** Muro persistente con simulacion de visita de victima / administrador.
* **DOM-Based XSS:** Analisis de flujo Source (`location.hash`) hacia Sinks peligrosos (`innerHTML`).

### 3. Sandbox Seguro & Servidor C2 Simulado
* Entorno iframe aislado con captura de alertas, lectura de cookies simuladas y solicitudes de exfiltracion.
* Consola interactiva de eventos en vivo.

### 4. Analizador Heuristico & Calculadora CVSS v3.1
* Deteccion estatica de vectores (scripts, event handlers, pseudo-protocolos, polyglots).
* Puntuacion de severidad CVSS v3.1 y mapeo con CWE-79 y OWASP Top 10 (A03:2021).
* Recomendaciones de remediacion contextuales.

### 5. Ofuscador & Bypass de Filtros
* Codificacion en tiempo real: HTML Entities (Dec/Hex), URL Encoding, Unicode Escapes, Base64 Data URI y JS CharCode.
* Evaluador automatico de bypass contra filtros y WAFs comunes.

### 6. Laboratorio de Content Security Policy (CSP)
* Editor de directivas CSP en vivo con plantillas (Insegura, Basica, Estricta con Nonce, Google Strict).
* Validador interactivo de bloqueo de payloads.

### 7. Retos CTF (8 Niveles)
* Desafios progresivos de explotacion en diferentes contextos (Body, Atributos, Strings JS, Sin Comillas, DOM Hash, Pseudo-protocolos, Polyglots).
* Sistema de pistas graduales y validacion automatica.

### 8. Generador de Reportes de Seguridad
* Formulario estructurado para hallazgos tecnicos.
* Exportacion a PDF (formato de impresion limpio), Markdown (`.md`) y JSON.

### 9. CheatSheet & Repositorio de Payloads
* Mas de 40 vectores reales clasificados con funcion de copia y envio directo al Sandbox.

---

## Instalacion y Uso

### Requisitos
* Node.js 18+ o superior
* npm

### Iniciar el Servidor de Desarrollo
```bash
npm install
npm run dev
```

La aplicacion estara disponible en `http://localhost:4321`.

### Construir para Produccion
```bash
npm run build
npm run preview
```
