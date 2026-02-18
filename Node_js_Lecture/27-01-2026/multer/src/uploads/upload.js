import multer from "multer";


// storage configuration

const storage = multer.diskStorage({
  destination:function(req , file , cb){
    cb(null , "uploads/")
  },
  filename:function(req , file , cb){
    cb(null , Date.now() + Path2D.extname(file.destination));
  }
})

// file filter 

// multer configuration