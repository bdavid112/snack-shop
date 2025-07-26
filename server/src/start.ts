import { buildServer } from './server'

async function start() {
  const app = await buildServer()

  app.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }

    app.log.info('🚀 Server is running at http://localhost:3000')
  })
}

void start()
