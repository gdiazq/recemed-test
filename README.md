# Recemed Minimal Project for Technical Test

## SSR

El ssr se implemento mediante Vike-Vite en el archivo [pages/index/+Page.jsx] este seria la primera pantalla del login pidiendo el rut

```javascript
import { validateRUT } from './validateRut';

export { Page }

function Page() {

  const handleSubmit = (e) => {
    const rut = e.target.rut.value;
    if (!validateRUT(rut)) {
      e.preventDefault();
      alert('Rut inválido. Por favor, verifica los datos e intenta nuevamente.');
    }
  }
  
  return (
    <>
      <div className="flex flex-col flex-wrap justify-center content-center h-screen">
        <h1 className="text-xl md:text-3xl font-semibold text-stone-600">Portal Paciente</h1>
        <h2 className="text-3xl md:text-5xl font-bold text-rm-blue-100 mb-4">Ingresa a tu Portal</h2>
        <div className="flex flex-col justify-center content-center">
          <form className="flex flex-col justify-center items-center" method="POST" action="/api/login/validate" onSubmit={handleSubmit}>
            <input 
              className="p-2 text-center rounded-tl-full rounded-tr-full rounded-br-full rounded-bl-full w-full" 
              type="text" 
              name="rut"
              placeholder="Ingresa tu Rut"
              required
              />
            <button
              type="submit"
              className="font-semibold text-white tracking-wider bg-rm-blue-100 hover:bg-rm-blue-200 p-2 rounded-tl-full rounded-tr-full rounded-br-full rounded-bl-full mt-4 w-full">
              SIGUIENTE
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
```

Utilizando el servidor express en el archivo [index.js], se destaca la linea res.redirect ya que eso permite que este actuando como ssr, 

```javascript
app.post('/api/login/validate', async (req, res) => {
    try {
      const { rut } = req.body;
      const user = await fetch(`http://rec-staging.recemed.cl/api/users/exists?rut=${rut}`).then(res => res.json());

      if (user?.data) {
        res.cookie('rut', rut, {
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
        res.redirect('/login');
      }
    } catch (error) {
      console.error(error);
    }
});
```

Ademas se utilizo a api [http://rec-staging.recemed.cl/api/users/exists] para ver si el usuario existe o no y ademas se ocupo una validacion [validateRut.js] para validar rut con formato 11111111-1

```javascript
export function validateRUT(rut) {
  // Verifica que el RUT esté en el formato correcto (solo puede contener un guion y no puntos)
  if (!/^[0-9]+-[0-9Kk]$/.test(rut)) {
      return false;
  }
  
  // Elimina el guion
  const cleanRUT = rut.replace("-", "");
  
  const rutBody = cleanRUT.slice(0, -1);
  let checkDigit = cleanRUT.slice(-1).toUpperCase();
  
  // Verifica si el cuerpo del RUT contiene solo números
  if (!/^[0-9]+$/.test(rutBody)) {
      return false;
  }
  
  let sum = 0;
  let multiplier = 2;
  
  // Calcula la suma ponderada del cuerpo del RUT
  for (let i = rutBody.length - 1; i >= 0; i--) {
      sum += multiplier * parseInt(rutBody.charAt(i));
      multiplier = (multiplier < 7) ? multiplier + 1 : 2;
  }
  
  // Calcula el dígito verificador
  const mod11 = 11 - (sum % 11);
  let calculatedCheckDigit = (mod11 === 11) ? "0" : (mod11 === 10) ? "K" : mod11.toString();
  
  return checkDigit === calculatedCheckDigit;
}
```

Despues de que el RUT se valida con api y con la validacion mostrada anteriormente queda la parte del login con la contraseña donde tambien se realizo con SSR en la direccion [pages/index/login/+Page.jsx]

```javascript
export { Page }

function Page() {

    return (
        <div className="flex flex-col flex-wrap justify-center content-center h-screen">
            <h1 className="text-xl md:text-3xl font-semibold text-stone-600">Portal Paciente</h1>
            <h2 className="text-3xl md:text-5xl font-bold text-rm-blue-100 mb-4">Ingresa a tu Portal</h2>
            <div className="flex flex-col justify-center content-center">
                <form className="flex flex-col justify-center items-center" method="POST" action="/api/login">
                    <input 
                        className="p-2 text-center rounded-tl-full rounded-tr-full rounded-br-full rounded-bl-full w-full" 
                        type="password"
                        name="password"
                        placeholder="Ingresa tu contraseña"
                        required
                    />
                    <button
                        type="submit"
                        className="font-semibold text-white tracking-wider bg-rm-blue-100 hover:bg-rm-blue-200 p-2 rounded-tl-full rounded-tr-full rounded-br-full rounded-bl-full mt-4 w-full">
                            INGRESAR
                    </button>
                </form>
            </div>
        </div>
    )
}
```

Y se utilizo el servidor del archivo index.js 

```javascript
app.post('/api/login/validate', async (req, res) => {
    try {
      const { rut } = req.body;
      const user = await fetch(`http://rec-staging.recemed.cl/api/users/exists?rut=${rut}`).then(res => res.json());

      if (user?.data) {
        res.cookie('rut', rut, {
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
        res.redirect('/login');
      }
    } catch (error) {
      console.error(error);
    }
  });
```
Se implemento el acceso seguro al dashboard mediante cookie con el siguiente codigo la funcion se llama [getCookies.js] 

```javascript
export function getCookie(name) {
  const cookieString = document.cookie;
  const cookieArray = cookieString.split('; ');

  for (let cookie of cookieArray) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }

  return null;
}
```

Se implementaron 2 hook para el SSR estos [useData.js] y [useUser.js] estos serian los codigos 

```javascript
export { useData }

import { usePageContext } from '../../renderer/usePageContext'

function useData() {
    const { data } = usePageContext()
    return data
}
```
Que nos permite un acceso directo a a la propiedad 'data' del contexto de la pagina, al usar 'useData()' en cualquier componente, nos permite acceder facilmente a los datos especificos de la pagina

```javascript
export { useUser }

import { usePageContext } from '../renderer/usePageContext'  

function useUser() {
    const { user } = usePageContext()
    return user
}
```

Que nos permite un acceso a la informacion del usuario dentro de cualquier componente que lo necesite, al usar 'useUser' se puede obtener el objeto 'user que esta almacenado en el contexto de la pagina

## CCR

La funcionalidad de Client-Side Rendering (CCR) se utiliza para mostrar un listado de recetas en la página de dashboard del paciente. La implementación se encuentra en el archivo [pages/index/login/dashboard/index/+Page.jsx]. A continuación, se detalla cómo se ha implementado y qué componentes clave se utilizan:

Funcionalidad
- Carga de Recetas: La página carga dinámicamente las recetas del paciente desde un API en el servidor, esta es [getRecipes.js]
- Paginación: Soporta la carga de más recetas a medida que el usuario se desplaza hacia abajo, gracias a la funcionalidad de paginación infinita.
- Manejo de Errores: Se maneja cualquier error de la API y se muestra un mensaje adecuado al usuario.

Interfaz de Usuario:
- Se muestra el nombre del paciente y las recetas en una cuadrícula con diferentes colores de fondo según el tipo de receta.
- Incluye un botón para cargar más recetas, que está habilitado solo si hay más recetas disponibles.

Manejo de Recetas:
- Las recetas se cargan y se añaden a la lista existente sin duplicados.
- Se actualiza el estado hasMore para indicar si hay más recetas para cargar.

Estado y Efectos:
- useState se usa para manejar el estado de las recetas, los errores, la página actual y si hay más recetas por cargar.
- useEffect se encarga de la llamada a la API para cargar las recetas cuando la página cambia.

```javascript
import { useEffect, useState } from "react";
import { getRecipes } from "../../../../lib/getRecipes";

function Page() {
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await getRecipes(page);

        if (response.length === 0) {
          setHasMore(false);
        } else {
          setRecipes((prev) => {
            const newRecipes = response.filter(
              (recipe) => !prev.some(p => p.id === recipe.id)
            );
            return [...prev, ...newRecipes];
          });
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchRecipes();
  }, [page]);

  const handleLoadMore = () => {
    if (hasMore) setPage(page + 1);
  };

  const patientName = recipes.length > 0 ? `${recipes[0].patient.first_name} ${recipes[0].patient.last_name}` : "Paciente";

  return (
    <>
      <header className="flex justify-end p-4 bg-gray-100">
        <p className="font-bold">{patientName}</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[1440px] mx-auto p-4">
        {error
          ? <p>{error}</p> 
          : recipes.map((recipe) => {
              let backgroundColor;
              switch (recipe.type) {
                case "Receta Retenida":
                  backgroundColor = "bg-emerald-100";
                  break;
                case "Receta Simple":
                  backgroundColor = "bg-cyan-100";
                  break;
                default:
                  backgroundColor = "bg-red-100";
              }

              return (
                <div
                  className={`p-4 rounded-[5px] text-sm shadow-md flex flex-col ${backgroundColor}`}
                  key={recipe.id}
                >
                  <div>
                    <span className="flex justify-between border-b-2 border-rm-blue-100">
                      <p>Folio: <span className="font-semibold">{recipe.code}</span></p>
                      <h3 className="font-bold text-rm-blue-100">Receta de Medicamentos</h3>
                    </span>
                    <hr className="text-rm-blue-200" />
                    <p>Fecha de emisión: {recipe.inserted_at}</p>
                    <p className="font-bold text-rm-blue-100">
                      Dr: {recipe.doctor.first_name} {recipe.doctor.last_name}
                    </p>
                    <p>{recipe.doctor.speciality}</p>
                    <p>Codigo: <span className="font-bold">{recipe.code}</span></p>
                  </div>
                </div>
              );
            })}
      </div>
      <div className="flex flex-col items-center mt-4 mb-8">
        <button 
          onClick={handleLoadMore} 
          disabled={!hasMore} 
          className="px-4 py-2 bg-rm-blue-100 text-white rounded disabled:opacity-50"
        >
          Mostrar más
        </button>
      </div>
    </>
  );
}

export { Page };
```
Este es el codigo de [getRecipes.js] que es una función getRecipes que realiza una solicitud HTTP para obtener un listado de recetas desde una API

- La función getRecipes se puede utilizar en un componente React o en otro contexto donde necesites obtener y manejar recetas desde la API.
- El token de autenticación se utiliza para autorizar la solicitud, lo cual es común en aplicaciones que requieren autenticación para acceder a datos protegidos.

```javascript
import { getCookie } from "./getCookie";

export const getRecipes = async (page) => {
  const token = getCookie('token') || '';

  const response = await fetch(`http://rec-staging.recemed.cl/api/patients/prescriptions?page=${page}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const { data } = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'Error fetching data');
  }

  return data;
};
```

Solicitud HTTP:

- URL: La URL de la API se construye dinámicamente usando el parámetro page para la paginación.
- Headers: Se incluyen dos encabezados en la solicitud 
* Authorization: Se usa el token de autenticación en el encabezado Bearer.
* Content-Type: Se especifica el tipo de contenido como application/json.

## Tailwind CSS

Se usa Tailwind CSS en todo el codigo sin codigo CSS nativo, solamente en el [index.css] para poder implementar tailwind css en toda las paginas.

Los colores son son:
- `"rm-blue-100": "#367CF4"`
- `"rm-blue-200": "#367cc8"`

Y esta es la configuracion de la pagina de [tailwind.config.js]

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './renderer/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',

  ],
  theme: {
    extend: {
      colors: {
        'rm-blue-100': '#367CF4',
        'rm-blue-200': '#367cc8',
      },
    },
  },
  plugins: [],
};
```