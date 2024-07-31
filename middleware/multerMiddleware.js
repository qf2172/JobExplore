import multer from "multer"
import DataParser from 'datauri/parser.js'
import path from 'path'
// disk storage
//const storage = multer.diskStorage({
//    destination: (req, file, cb) => {
//        cb(null, 'public/uploads')
//    },
//    filename: (req, file, cb) => {
//        const fileName = file.originalname
//        cb(null, fileName)
//    }
//})
// store image on Cloudinary
// use buffer
const storage = multer.memoryStorage()

const upload = multer({ storage })
const parser = new DataParser()
export const formatImage = (file) => {
    console.log("file:",file)
    const fileExtension = path.extname(file.originalname).toString()
    console.log(fileExtension)
    const content1 = parser.format(fileExtension, file.buffer).content
    console.log(content1)
    return content1
}
export default upload