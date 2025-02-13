import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import scriptGenerateController from './components/controllers/scriptgenerate.controller.js'
import videoGenerateController from './components/controllers/videogenerate.controller.js'
// import { checkVideoStatus } from './components/controllers/videoStatus.controller.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.post('/api/generate-script', scriptGenerateController)
app.post('/api/generate-video', videoGenerateController)
// app.get('/api/video-status/:taskId', checkVideoStatus)

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`)
})

