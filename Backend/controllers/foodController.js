import foodModel from "../models/foodModel.js";
import fs from "fs";

const addFood = async (req, res) => {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No image file received"
        });
    }

    const image_filename = req.file.filename;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    });

    try {
        await food.save();
        res.json({
            success: true,
            message: "Food Added"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Allfood list

const listFood =async (req,res)=>{
    try{
        const foods =await foodModel.find({});
        res.json({success:true,data:foods})
        
    }catch(error){
    res.json({success:false,message:"Error"})
    }

}

// remove food item

const removeFood =async (req,res)=>{
    try {
        const food =await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food Removed"})
    } catch (error) {
        console.log(error);
        res.json({sucess:false,message:"Error"})
    }

}

export { addFood,listFood ,removeFood};