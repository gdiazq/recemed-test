import express from 'express'
import compression from 'compression'
import { renderPage } from 'vike/server'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { root } from './root.js'
const isProduction = process.env.NODE_ENV === 'production'

startServer()

async function startServer() {
  const app = express()

  app.use(compression())
  app.use(cookieParser());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  api(app);

  if (isProduction) {
    
    const sirv = (await import('sirv')).default
    app.use(sirv(`${root}/dist/client`))
  } else {
    const vite = await import('vite')
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true }
      })
    ).middlewares
    app.use(viteDevMiddleware)
  }

  app.get('*', async (req, res, next) => {
    const logged = !!req.cookies['token']; 

    const pageContextInit = {
      urlOriginal: req.originalUrl,
      headersOriginal: req.headers,
      user: {
        logged,
      },
    };
    const pageContext = await renderPage(pageContextInit);
    if (pageContext.errorWhileRendering) {
      // Install error tracking here, see https://vike.dev/errors
    }
    const { httpResponse } = pageContext
    if (!httpResponse) {
      return next()
    } else {
      const { body, statusCode, headers, earlyHints } = httpResponse
      if (res.writeEarlyHints) res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
      headers.forEach(([name, value]) => res.setHeader(name, value))
      res.status(statusCode)
      res.send(body)
    }
  });

  const port = process.env.PORT || 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}

function api(app) {
  app.post('/api/login', async (req, res) => {
    try {
      const { rut } = req.cookies;
      const { password } = req.body;
    
      const user = await fetch("http://rec-staging.recemed.cl/api/users/log_in", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: { rut, password } })
      }).then(res => res.json());
    
      if (user?.errors) {
        res.redirect(`/login?error=${encodeURIComponent(user.errors.detail)}`);
      } else if (user?.data) {
        const { token, profiles } = user.data;
    
        res.cookie('token', token, {
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.cookie('user-data', JSON.stringify(profiles), {
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.redirect('/login/dashboard');
      }
    } catch (error) {
      console.error(error);
    }
  });


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
}
