export { Page }

import { useState } from 'react';

function Page(pageContext) {
  const [rut, setRut] = useState('');
  const isValidRut = pageContext.isValidRut;

  const handleSubmit =  (e) => {
    e.preventDefault();
    window.location.href = `/validate?rut=${encodeURIComponent(rut)}`;
  }

  return (
    <>
      <div className="flex flex-col flex-wrap justify-center content-center h-screen">
        <h1 className="text-xl md:text-3xl font-semibold text-stone-600">Portal Paciente</h1>
        <h2 className="text-3xl md:text-5xl font-bold text-rm-blue-100 mb-4">Ingresa a tu Portal</h2>
        <div className="flex flex-col justify-center content-center">
          <form className="flex flex-col justify-center items-center" type="get">
            <input 
              className="p-2 text-center rounded-tl-full rounded-tr-full rounded-br-full rounded-bl-full w-full" 
              type="text" 
              value={rut}
              id="rut"
              onChange={(e) => setRut(e.target.value)}
              placeholder="Ingresa tu Rut"/>
            <button
              onClick={handleSubmit}
              className="font-semibold text-white tracking-wider bg-rm-blue-100 hover:bg-rm-blue-200 p-2 rounded-tl-full rounded-tr-full rounded-br-full rounded-bl-full mt-4 w-full">
              SIGUIENTE
            </button>
          </form>
          {isValidRut === false && (
            <p className="text-red-500 mt-4">Rut invalido. Por favor, ingrese un rut valido.</p>
          )}
        </div>
      </div>
    </>
  )
}
