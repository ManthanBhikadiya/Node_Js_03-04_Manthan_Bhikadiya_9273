import express from 'express'
import multer from 'multer'
import { uploadFile } from '../controller/file.controller.js'
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import {v2 as cloudinary} from 'cloudinary'

const router = express.Router()

cloudinary.config({
  cloud_name:"dehf5sbvn",
  api_key:"268546367962766",
  api_secret:"7eKR4F_lh02APXVNLa7GhCYQfSg"
})

// storage setup

const storage = new CloudinaryStorage({
  cloudinary:cloudinary,

  param:async (req , file) => {
    let resourceType = "image";
    if(file.mimetype === 'application/image'){
       resourceType = "raw";
    }
    return{
      resource_type:resourceType,
      folder:"app_asset",
      allowed_formats:['jpeg' , 'jpg' , 'png' , 'gif' , 'webp']
    }
  },
})

export const upload = multer({
  storage,
  limits:{
    fileSize:5 * 1024 * 1024
  },
  fileFilter:(req , file , cb) => {

    const allowed = /jpeg|jpg|png|gif|webp/;
    
    if(allowed.test(file.mimetype)){
      cb(null , true)
    }else{
      cb(new Error('Only Images are allowed.'))
    }
  }
})

router.post('/' , upload.single('file') , uploadFile)

export default router
