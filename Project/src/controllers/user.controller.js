import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import {User} from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";    
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { upload } from "../middlewares/multer.middleware.js";

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
        return {accesstoken, refreshToken};

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
    const {accesstoken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = { 
        httpOnly: true,
        secure: true
    };

    return res.status(200).cookie("accessToken", accesstoken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200, {user: loggedInUser, accesstoken, refreshToken},"User logged in successfully")
    );
})

const logoutUser = asyncHandler(async(req,res)=>{
        //clear the cookies
        User.findByIdAndUpdate(req.user._id, 
           {
            $set:{
                refreshToken: undefined
            }
           },
           {
            new:true
           }
        )
        const options = {
            httpOnly: true,
            secure: false
        };
        return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(
            new ApiResponse(200, null,"User logged out successfully")
        );

});

const refreshAccesToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(400,"Refresh token is required");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);

        if(!user){
            throw new ApiError(404,"Invalid refresh token");
        }

        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used");
        }

        const {accesstoken, NewrefreshToken} = await generateAccessAndRefreshTokens(user._id);

        const options = {
            httpOnly: true,
            secure: false
        };

        return res.status(200).cookie("accessToken", accesstoken, options).cookie("refreshToken", NewrefreshToken, options).json(
            new ApiResponse(200, {accesstoken, NewrefreshToken},"Access token refreshed successfully")
        );
    } catch (error) {
        throw new ApiError(401,"Invalid refresh token");
    }
})

const changeCurrentUserPassword = asyncHandler(async(req,res)=>{
       const{currentPassword, newPassword} = req.body;

       const user = await User.findById(req.user?.id);
       const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);

       if(!isPasswordCorrect){
        throw new ApiError(401,"Current password is incorrect");
       }
       user.password = newPassword;
       await user.save({validateBeforeSave: false});
       return res.status(200).json(
           new ApiResponse(200, {}, "Password changed successfully")
       );
})      


const getCurrentUserDetails = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user?._id).select("-password -refreshToken");
    return res.status(200).json(
        new ApiResponse(200, {user}, "User details fetched successfully")
    );
})

const updateCurrentUserDetails = asyncHandler(async(req,res)=>{
    const {fullname,email} = req.body;

    if(!fullname || !email){
        throw new ApiError(400,"Fullname and email are required");
    }
    const user = await User.findByIdAndUpdate(req.user?._id,{
        $set :{fullname,email}
    },{new : true}).select("-password");
    return res.status(200).json(
        new ApiResponse(200, {user}, "User details updated successfully")
    );
})

const UpdateUserAvatar = asyncHandler(async(req,res)=>{
    const avatarPath = req.file?.path;
    if(!avatarPath){
        throw new ApiError(400,"Avatar image is required");
    }
    const avatar = await uploadToCloudinary(avatarPath);
    if(!avatar.url){
        throw new ApiError(500,"Error uploading avatar");
    }
    const user = await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            avatar: avatar.secure_url
        }
    },{new:true}).select("-password");
    return res.status(200).json(
        new ApiResponse(200, {user}, "User avatar updated successfully")
    );
    
})

const UpdateUserCoverImage = asyncHandler(async(req,res)=>{
    const coverImagePath = req.file?.path;
    if(!coverImagePath){
        throw new ApiError(400,"Cover image is required");
    }
    const coverImage = await uploadToCloudinary(coverImagePath);
    if(!coverImage.url){
        throw new ApiError(500,"Error uploading cover image");
    }
    const user = await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            coverImage: coverImage.secure_url
        }
    },{new:true}).select("-password");
    return res.status(200).json(
        new ApiResponse(200, {user}, "User cover image updated successfully")
    );
    
})

const getUserChannelProfile = asyncHandler(async(req,res)=>{
    const {username} = req.params;
    if(!username?.trim()){
        throw new ApiError(400,"Username is required");
    }
    const channel = await User.aggregate([
        {
            $match: {
                username: username?.trim()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
        }
    },
    {
        $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "subscriber",
            as: "subscriptionsToChannels"
        }
    },
    {
        $addFields: {
            subscriberCount: {$size: "$subscribers"},
            subscribedToChannelsCount: {$size: "$subscriptionsToChannels"},
            isSubscribed: {
                $cond:{
                    if:{$in : [new mongoose.Types.ObjectId(req.user?._id), "$subscribers.subscriber"]},
                    then: true,
                    else: false

                }
            }
        }
    },
    {
        $project: {
            fullname: 1,
            username: 1,
            subscriberCount: 1,
            subscribedToChannelsCount: 1,
            isSubscribed: 1,
            avatar: 1,
            coverImage: 1,
            email: 1
        }
    }
    ])
    if(!channel || channel.length === 0){
        throw new ApiError(404,"Channel not found");
    }return res.status(200).json(
        new ApiResponse(200, {channel: channel[0]}, "Channel profile fetched successfully")
    )
})

export {registerUser, loginUser,logoutUser, refreshAccesToken, changeCurrentUserPassword, getCurrentUserDetails, updateCurrentUserDetails, UpdateUserAvatar, UpdateUserCoverImage, getUserChannelProfile}