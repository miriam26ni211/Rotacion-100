// Este archivo puede quedarse como referencia de estilos si lo usas
// No es necesario importar nada aquí si solo quieres CSS global

// Tab styles
.tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.tab-button {
  padding: 0.5rem 1rem;
  border: none;
  background: #e0f2ff;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  color: black;
  transition: 0.3s;
}

.tab-button:hover {
  background: #cce0ff;
}

.tab-button.active {
  background: #0077cc;
  color: white;
}
