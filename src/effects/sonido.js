// Funciones para reproducir efectos de sonido

// Función genérica para reproducir cualquier sonido dado su URL
export function reproducirSonido(url) {
  const audio = new Audio(url);
  audio.play().catch((err) => console.error('Error al reproducir sonido:', err));
}

// Función específica para reproducir la caja registradora
export function reproducirCaja() {
  reproducirSonido('/sonidos/caja-registradora.mp3');
}

// Ejemplo: puedes agregar más funciones para otros efectos
// export function reproducirCelebracion() {
//   reproducirSonido('/sonidos/celebracion.mp3');
// }

// export function reproducirError() {
//   reproducirSonido('/sonidos/error.mp3');
// }
