import express from 'express'
import 'dotenv/config'

const app = express()

const port = process.env.PORT

app.get('/', (req, res) => {
   res.send('newly created server')
})

app.listen(port, () => {
   console.log(`server is running http://localhost:${port}`)
} )