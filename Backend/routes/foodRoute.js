import express from "express"
import { addFood } from "../controllers/foodController.js"
import multer from "multer"  //using this we will create the image storage system

const foodRouter =express.Router();

//Image Storage Engine



const storage =multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({
    storage:storage
})

foodRouter.post(
  "/add",
  (req, res, next) => {
    console.log("✅ Route Hit");
    next();
  },
  upload.single("image"),
  addFood
);




export default foodRouter;