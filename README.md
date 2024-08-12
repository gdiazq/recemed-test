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

Utilizando el servidor express que utilizando el archivo [index.js]

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