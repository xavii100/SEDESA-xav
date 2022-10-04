import React, { useEffect, useState } from 'react'

// Container globales
import Resumen from '../../components/tableros/Containers/Resumen'
import Casos from '../../components/tableros/Containers/Casos'
import AtencionCOVID from '../../components/tableros/Containers/AtencionCOVID'
import Vacunacion from '../../components/tableros/Containers/Vacunacion'

const Tableros = () => {
  const [option, setOption] = useState('resumen');

  useEffect(() => {
  }, [option]);

  const handleClick = e => {
    setOption(() => e.target.id)
  };

  return (
    <div className='grid grid-cols-12 gap-3 p-4 m-2'>
      {/* Menu */}
      <aside className='col-span-2 border-2 border-blue-600'>
        <section className='grid grid-cols-1 pl-8 pr-2 py-2'>
          <button id='resumen' onClick={handleClick} className='text-left pl-1 my-1 border-2 border-blue-600'>
            Resumen diario
          </button>
          <button id='casos' onClick={handleClick} className='text-left pl-1 my-1 border-2 border-blue-600'>
            Casos
          </button>
          <button id='atencion' onClick={handleClick} className='text-left pl-1 my-1 border-2 border-blue-600'>
            Atención por COVID-19
          </button>
          <button id='vacunacion' onClick={handleClick} className='text-left pl-1 my-1'>
            Vacunación
          </button>
        </section>
      </aside>

      {/* Graficas */}
      <main className='col-span-10 p-2 border-2 border-green-600'>
        <section className='grid grid-cols-1'>
          { option === 'resumen' && <Resumen/> }
          { option === 'casos' && <Casos/> }
          { option === 'atencion' && <AtencionCOVID/> }
          { option === 'vacunacion' && <Vacunacion/> }
        </section>
      </main>
    </div>
  )
}

export default Tableros