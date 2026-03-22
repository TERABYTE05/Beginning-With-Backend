import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (localPath) => {
    try{
        if(!localPath) return null;
        const result = await cloudinary.uploader.upload(localPath, {resource_type: "auto"});
        //console.log("file is uploaded successfully on cloudinary",result.url);
        fs.unlinkSync(localPath);// remove the file from local storage after uploading to cloudinary
        return result;
        }catch(error){
            fs.unlinkSync(localPath);// remove the file from local storage after uploading to cloudinary
            console.error("Error uploading image to Cloudinary:", error);
            return null;
        }
    }

export {uploadToCloudinary};


