fetch('/health').then(async response => {
  document.querySelector('#salud').textContent = response.ok ? 'MongoDB conectado. API lista.' : 'La base de datos no está disponible.';
}).catch(() => { document.querySelector('#salud').textContent = 'No se pudo contactar al servidor.'; });
