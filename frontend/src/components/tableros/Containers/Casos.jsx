import React from 'react'
import BarChart from '../Charts/BarChart'

const Casos = () => {
  return (
    <section className='grid grid-cols-6 gap-2'>
      <span className='font-semibold text-base border-b-2 col-span-6'>Positividad</span>
      <div className='col-span-2 border-2 border-green-600 px-3 pt-2'>
        <div className='grid grid-cols-1'>
          <span className='font-semibold text-lg'>Resultados de pruebas</span>
          <span className='font-extralight text-[0.7rem] mt-2'>Actualización al 22 de abril de 2022</span>
          <p className='font-base text-sm mt-7'>
            Registros de personas usuarias
            que ingresaron a las unidades
            hospitalarias adscritas a la
            Secretaria de Salud de la Ciudad de México.
          </p>
        </div>
      </div>
      <div className='col-span-4'>
        <div id='casosPositividad' className='chart'/>
        <BarChart id_chart='casosPositividad'/>
      </div>
    </section>
  )
}

export default Casos