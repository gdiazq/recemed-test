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

Despues de que el RUT se valida con api y con la validacion mostrada anteriormente queda la parte del login con la contraseña donde tambien se realizo con SSR 

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

