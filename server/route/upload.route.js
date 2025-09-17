import { Router } from 'express'
import multer from 'multer'
import auth from '../middleware/auth.js'
import uploadImageController from '../controllers/uploadImage.controller.js'

const uploadRouter = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

uploadRouter.post("/upload", auth, upload.single('image'), uploadImageController)

export default uploadRouter
