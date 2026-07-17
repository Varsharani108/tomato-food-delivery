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

export { addFood };