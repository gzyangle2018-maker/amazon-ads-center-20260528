import { Hono } from 'hono'
import ads from './routes/ads'

const app = new Hono()

// Health check
app.get('/', (c) => {
  return c.json({
    name: 'Amazon Ads Center API',
    version: '1.0.0',
    status: 'ok',
  })
})

// Mount API routes
app.route('/api', ads)

export default app
