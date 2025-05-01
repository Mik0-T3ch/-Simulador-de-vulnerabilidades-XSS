document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('xss-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const payload = document.getElementById('payload').value;
    const resultBox = document.getElementById('xss-result');

    // Limpiar el contenido anterior antes de mostrar el nuevo
    resultBox.innerHTML = '';

    // Mostrar el contenido del payload en el resultBox
    resultBox.innerHTML = payload;

    // Establecer el color del resultBox dependiendo del tipo de contenido
    if (payload.includes("<script>")) {
      resultBox.style.backgroundColor = "red"; // Fondo rojo si es un XSS (para simular un ataque)
      resultBox.style.color = "white"; // Texto blanco sobre fondo rojo
    } else {
      resultBox.style.backgroundColor = "#16a34a"; // Fondo verde si es HTML visible
      resultBox.style.color = "black"; // Texto negro
    }

    // Forzar la ejecución de los scripts dentro del payload
    const temp = document.createElement('div');
    temp.innerHTML = payload;
    const scripts = temp.querySelectorAll('script');
    scripts.forEach((script) => {
      const newScript = document.createElement('script');
      if (script.src) {
        newScript.src = script.src;
      } else {
        newScript.textContent = script.innerText;
      }
      document.body.appendChild(newScript);
    });

    // Enviar al backend (opcional)
    try {
      await fetch('http://localhost:3000/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: payload,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.warn('Error al enviar al backend:', error);
    }
  });
});
