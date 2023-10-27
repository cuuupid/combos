const express = require('express')
const dotenv = require('dotenv')
dotenv.config()

const Replicate = require('replicate')
const app = express()
const PORT = 5656

const replicate = new Replicate()

app.use((q, s, n) => {
  // Set CORS headers
  s.header('Access-Control-Allow-Origin', '*')
  s.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  s.header('Access-Control-Allow-Headers', '*')

  // sponge preflights
  if (q.method === 'OPTIONS') {
    s.sendStatus(204)
    return
  }
  n()
})
app.use(express.json())

app.post('/model/get', async (q, s) => {
  const [org, name] = q.body.model.split('/')
  const model = await replicate.models.get(org, name)
  s.json(model).status(200).send()
})

app.post('/model/run', async (q, s) => {
  const { id, input } = q.body
  console.log(id)
  console.log(input)
  const result = await replicate.run(id, {input,})
  console.log(result)
  return s.json(result).status(200).send()
})

app.listen(PORT, () => console.log(`listening ::${PORT}`))