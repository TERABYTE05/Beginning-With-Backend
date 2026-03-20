import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImageToCloudinary = async (localPath) => {
    try{
        if(!localPath) return null;
        const result = await cloudinary.uploader.upload(localPath, {resource_type: "auto"});
        console.log("file is uploaded successfully on cloudinary",result.url);
        return result;
        }catch(error){
            fs.unlinkSync(localPath);// remove the file from local storage after uploading to cloudinary
            console.error("Error uploading image to Cloudinary:", error);
            return null;
        }
    }

export {uploadImageToCloudinary};


cloudinary.v2.uploader.upload("https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fnature&ved=0CBYQjRxqFwoTCKDVlrjJrpMDFQAAAAAdAAAAABAH&opi=89978449", {public_id: "Trees"},
    function(error, result){
        if(error){
            console.error("Error uploading image to Cloudinary:", error);
        }else{
            console.log("Image uploaded successfully. URL:", result.secure_url);
        }
    }
);