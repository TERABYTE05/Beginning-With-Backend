import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import {Tweet} from "../models/tweet.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";    
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { upload } from "../middlewares/multer.middleware.js";

const CreateTweet = asyncHandler(async(req,res)=>{
    //TODO : create a tweet for a user
})

const getUserTweets = asyncHandler(async(req,res)=>{
    //TODO : get all tweets for a user
})

const updateTweet = asyncHandler(async(req,res)=>{
    //TODO : update a tweet by id
})

const deleteTweet = asyncHandler(async(req,res)=>{
    //TODO : delete a tweet by id
})

export {CreateTweet, getUserTweets, updateTweet, deleteTweet}