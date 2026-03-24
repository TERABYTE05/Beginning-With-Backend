import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import {User} from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";    
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req,res)=>{
    // get user detail from frontend

    const {fullname,email,username,password} = req.body;
    console.log("email:",email);
    
    //validation of user details
    if(
        [fullname,email,username,password].some((field)=>field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are required");
    }
    // if (fullname === "" || email === "" || username === "" || password === "") {
    //     throw new ApiError(400,"All fields are required");
    
    //check if user already exists
    const existingUser = await User.findOne({
        $or:[{email}, {username}]
    });
    if(existingUser){
        throw new ApiError(409,"User with email or username already exists");
    }

    //check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    // console.log(req.files);

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required");
    }
    //upload the image to cloudinary,avatar
    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverImage = await uploadToCloudinary(coverImageLocalPath);

   

    if(!avatar){
        throw new ApiError(500,"Error uploading avatar");
    }

    //create user object-create entry in db
    const user = await User.create({
        fullname,
        email,
        username:username.toLowerCase(),
        password,
        avatar: avatar.secure_url,
        coverImage: coverImage?.secure_url || "",
    })
   
    //remove password and refresh token field from response
    const CreatedUser = await User.findById(user._id).select("-password -refreshToken");  
     //check for user creation  
    if(!CreatedUser){
        throw new ApiError(500,"Error creating user");
    }     
     //return response to frontend
    return res.status(201).json(
        new ApiResponse(200,CreatedUser,"User registered successfully")
    )
    
    
   
    
})
const generateAccessAndRefreshTokens = async (userId)=>{
    try {
        const user=await User.findById(userId);
        const accesstoken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return {accessToken, refreshToken};

    } catch (error) {
        throw new ApiError(500,"Error generating tokens");
        
    }
}
const loginUser = asyncHandler(async(req,res)=>{
    //send cookie and response
    // req body -> data
    const {email,username,password} = req.body;

    //username or email
    if(!email && !username){
        throw new ApiError(400,"Either email or username is required");
    }
    //find the user
    const user = await User.findOne({
        $or: [{email}, {username}]
    });

    if(!user){
        throw new ApiError(404,"User not found");
    }
    
    //password check
    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials");
    }
    
    //access token and refresh token
    const {accessToken, refreshToken} = await user.generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = { 
        httpOnly: true,
        secure: true
    };

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200, {user: loggedInUser, accessToken, refreshToken},"User logged in successfully")
    );
})




export {registerUser, loginUser}