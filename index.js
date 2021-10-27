import express from 'express'
import cors from 'cors'

import sampleRoutes from './routes/sample.routes.js'

const app = express()

app.use(cors())

app.use('/sample', sampleRoutes)

const port = process.env.PORT || 3000

const server = app.listen(port, (err) => {
    if(err) {
        console.log(err)
    }
    console.log(`Server is listening on port ${port}`)
})

export default app