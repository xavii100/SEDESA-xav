import React from 'react'
import LineChart from '../Charts/LineChart'

const Resumen = () => {
  return (
    <>
    {/* Resumen */}
    <section className='grid grid-cols-6 gap-2'>
      <div className='col-span-2 border-2 border-green-600'>
        <div className='grid grid-cols-1 px-3 pt-2'>
          <span className='font-light text-lg border-b-2'>Casos</span>
          <span className='font-semibold text-lg'>Casos confirmados</span>
          <span className='font-extralight text-[0.7rem] mt-2'>Actualización al 22 de abril de 2022</span>
          <span className='font-light text-sm mt-7'>Últimos 7 días</span>
          <span className='font-semibold'>99,999</span>
          <span className='font-semibold text-sm mt-7 text-center'>Tasa por 100,000 habitantes: 999</span>
          <span className='font-light text-[0.6rem] mt-3 text-center'>Casos positivos diarios de la Ciudad de México</span>
          <span className='font-light text-[0.6rem] text-center'>(Promedio móvil de 7 días)</span>
          <div id='resumenCasos' className='chart'/>
          <LineChart id_chart='resumenCasos'/>
        </div>
      </div>
      <div className='col-span-4 border-2 border-green-600 px-3 pt-2'>
        <span className='font-light text-lg border-b-2 grid grid-cols-1'>Atención por COVID-19</span>
        <div className='grid grid-cols-2 gap-2'>
          <div className='grid grid-cols-1'>
            <span className='font-semibold text-lg'>Ingresos hospitalarios</span>
            <span className='font-extralight text-[0.7rem] mt-2'>Actualización al 22 de abril de 2022</span>
            <span className='font-light text-sm mt-7'>Últimos 7 días</span>
            <span className='font-semibold'>99,999</span>
            <span className='font-light text-[0.6rem] mt-3 text-center'>Casos positivos diarios de la Ciudad de México</span>
            <span className='font-light text-[0.6rem] text-center'>(Promedio móvil de 7 días)</span>
            <div id='resumenIngresos' className='chart'/>
            <LineChart id_chart='resumenIngresos'/>
          </div>
          <div className='grid grid-cols-1'>
            <span className='font-semibold text-lg'>Egresos hospitalarios</span>
            <span className='font-extralight text-[0.7rem] mt-2'>Actualización al 22 de abril de 2022</span>
            <span className='font-light text-sm mt-7'>Últimos 7 días</span>
            <span className='font-semibold'>99,999</span>
            <span className='font-light text-[0.6rem] mt-3 text-center'>Casos positivos diarios de la Ciudad de México</span>
            <span className='font-light text-[0.6rem] text-center'>(Promedio móvil de 7 días)</span>
            <div id='resumenEgresos' className='chart'/>
            <LineChart id_chart='resumenEgresos'/>
          </div>
        </div>
      </div>
    </section>

    {/* Casos activos */}
    <section className='grid grid-cols-6 gap-2 pt-2'>
      <div className='col-span-6 border-2 border-green-600 px-3 pt-2'>
        <span className='font-semibold text-[1.5rem] grid grid-cols-1'>Casos activos </span>
        <div className='grid grid-cols-2 gap-2'>
          <div className='grid grid-cols-1 px-3 pt-2'>
            <span className='font-semibold text-lg border-b-2'>Por sede hospitalaria</span>
            <span className=''>Personas usuarias que ingresaron a las sedes hospitalarias por COVID-19</span>
            <span className='font-extralight text-sm mt-2'>Últimos 7 días</span>
            <div id='resumenCasos' className='chart'/>
            {/* <LineChart id_chart='resumenCasos'/> */}
          </div>
          <div className='grid grid-cols-1 px-3 pt-2'>
            <span className='font-semibold text-lg border-b-2'>Por lugar de residencia</span>
            <span className=''>Lugar de residencia de las personas usuarias que ingresaron por COVID-19</span>
            <span className='font-extralight text-sm mt-2'>Últimos 7 días</span>
            <div id='resumenCasos' className='chart'/>
            {/* <LineChart id_chart='resumenCasos'/> */}
          </div>
        </div>
      </div>
    </section>

    {/* Vacunacion */}
    <section className='grid grid-cols-4 gap-1 pt-2'>
      <div className='col-span-4 border-2 border-green-600 px-3 pt-2'>
        <span className='font-light text-lg border-b-2 grid grid-cols-1'>Vacunación</span>
        <div className='grid grid-cols-4 gap-3'>
          <div className='grid grid-cols-1'>
            <span className='font-semibold text-[1.3rem]'>Personas con vacuna<sup>1</sup></span>
            <span className='font-extralight text-[0.7rem] mt-1'>Actualización al 22 de abril de 2022</span>
            <span className='mt-1'>
              Registros de personas que ingresaron a las unidades hospitalarias adscritas a la Secretaría de la Salud de la Ciudad de México
            </span>
          </div>
          <div className='col-span-3'>
            <div className='grid grid-rows-2 gap-2'>
              <div className='row-span-1'>
                <span className='font-light text-lg grid grid-cols-3'>Últimos 7 días</span>
                <div className='grid grid-cols-3 gap-2'>
                  <div className='grid grid-cols-1'>
                    <span className='font-light'>Una dosis</span>
                    <span className='font-semibold text-[1.2rem]'>99,999,000</span>
                  </div>
                  <div className='grid grid-cols-1'>
                  <span className='font-light'>Dos dosis</span>
                    <span className='font-semibold text-[1.2rem]'>99,999,000</span>
                  </div>
                  <div className='grid grid-cols-1'>
                  <span className='font-light'>Refuerzo</span>
                    <span className='font-semibold text-[1.2rem]'>99,999,000</span>
                  </div>
                </div>
              </div>
              <div className='row-span-1'>
                <span className='font-light text-lg grid grid-cols-3'>Totales</span>
                <div className='grid grid-cols-3 gap-2'>
                  <div className='grid grid-cols-1'>
                    <span className='font-light'>Una dosis</span>
                    <span className='font-semibold text-[1.2rem]'>99,999,000</span>
                  </div>
                  <div className='grid grid-cols-1'>
                  <span className='font-light'>Dos dosis</span>
                    <span className='font-semibold text-[1.2rem]'>99,999,000</span>
                  </div>
                  <div className='grid grid-cols-1'>
                  <span className='font-light'>Refuerzo</span>
                    <span className='font-semibold text-[1.2rem]'>99,999,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span className='font-extralight text-[0.7rem] grid grid-cols-1 py-2'>
          1. Información de la población que ingresó a alguna unidad hospitalaria adscrita a la Secretaria de Salud de la Ciudad de México.
          No representa el avance en la campaña de vacunación contra la COVID-19.
        </span>
      </div>
    </section>

  </>
  )
}

export default Resumen