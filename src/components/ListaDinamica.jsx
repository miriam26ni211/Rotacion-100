import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import './ListaDinamica.css'

export default function ListaDinamica() {
  const [usuarios, setUsuarios] = useState([])
  const [mostrarDropdown, setMostrarDropdown] = useState(false)

  useEffect(() => {
    fetchUsuarios()
    const channel = supabase
      .channel('public:usuarios')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'usuarios' },
        () => fetchUsuarios()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const fetchUsuarios = async () => {
    let { data } = await supabase.from('usuarios').select('*')

    const lista = Array.from({ length: 100 }, (_, i) => {
      const pos = 100 - i  // Cambiado: ahora empieza desde 100 hacia 1
      const usuario = data.find((u) => u.posicion === pos)
      return {
        posicion: pos,
        nombre: usuario?.nombre || '-',
        completado: usuario?.completado || false,
      }
    })
    setUsuarios(lista)
  }

  const intermedios = usuarios.slice(1, -1)

  return (
    <section className="lista-dinamica">
      {/* Título - SIN el pequeño 100 rojo */}
      <div className="titulo-container">
        <h2 className="titulo-principal">Rotacion100</h2>
      </div>

      {/* Lista */}
      <div className="lista-container">
        {usuarios.length > 0 ? (
          <ul className="lista-usuarios">
            {/* Posición 100 - TOP (ahora es la primera) */}
            <li className="usuario-item top-item">
              <div className="posicion-badge">100</div>
              <div className="usuario-info">
                <div className={`nombre-usuario ${usuarios[0].completado ? 'completed' : ''}`}>
                  {usuarios[0].nombre}
                </div>
                {/* Eliminado: <div className="premio-info">₡100</div> */}
              </div>
            </li>

            {/* Dropdown intermedios */}
            <li className="dropdown-container">
              <button
                className="dropdown-btn"
                onClick={() => setMostrarDropdown(!mostrarDropdown)}
              >
                {mostrarDropdown
                  ? 'Ocultar posiciones intermedias'
                  : 'Ver posiciones intermedias'}
              </button>
              
              {mostrarDropdown && (
                <div className="intermedios-container">
                  {intermedios.map((u) => (
                    <div key={u.posicion} className="usuario-item intermedio-item">
                      <div className="posicion-badge">{u.posicion}</div>
                      <div className="usuario-info">
                        <div className={`nombre-usuario ${u.completado ? 'completed' : ''}`}>
                          {u.nombre}
                        </div>
                        {/* Eliminado: <div className="premio-info">₡100</div> */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </li>

            {/* Posición 1 - BOTTOM (ahora es la última) */}
            <li className="usuario-item bottom-item">
              <div className="posicion-badge">1</div>
              <div className="usuario-info">
                <div className={`nombre-usuario ${usuarios[usuarios.length - 1].completado ? 'completed' : ''}`}>
                  {usuarios[usuarios.length - 1].nombre}
                </div>
                {/* Eliminado: <div className="premio-info">₡100</div> */}
              </div>
            </li>
          </ul>
        ) : (
          <div className="loading-container">
            <p>Cargando lista…</p>
          </div>
        )}
      </div>
    </section>
  )
}
