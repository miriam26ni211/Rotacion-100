// Animaciones de entrada y celebración

// Función para animar la entrada de un elemento (fade in + slide)
export function animarEntrada(element) {
  if (!element) return;

  element.style.opacity = 0;
  element.style.transform = 'translateY(-20px)';
  element.style.transition = 'opacity 0.5s, transform 0.5s';

  requestAnimationFrame(() => {
    element.style.opacity = 1;
    element.style.transform = 'translateY(0)';
  });
}

// Función para animar celebración cuando alguien llega a #100
export function animarCelebracion() {
  const gif = document.createElement('img');
  gif.src = '/gifs/celebracion.gif';
  gif.alt = 'Celebración';
  gif.style.position = 'fixed';
  gif.style.top = '50%';
  gif.style.left = '50%';
  gif.style.transform = 'translate(-50%, -50%)';
  gif.style.zIndex = 9999;
  gif.style.width = '300px';
  gif.style.height = '300px';
  document.body.appendChild(gif);

  // Quitar GIF después de 3 segundos
  setTimeout(() => {
    document.body.removeChild(gif);
  }, 3000);
}

// Función para resaltar temporalmente un elemento (por ejemplo #1 o #100)
export function resaltarElemento(element, color = 'yellow', duration = 1500) {
  if (!element) return;
  const original = element.style.backgroundColor;
  element.style.backgroundColor = color;

  setTimeout(() => {
    element.style.backgroundColor = original;
  }, duration);
}
