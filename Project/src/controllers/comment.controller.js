import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import {Comment} from "../models/comment.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";    
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { upload } from "../middlewares/multer.middleware.js";


const getVideoComments = asyncHandler(async(req,res)=>{
    //TODO :  get all comments for a video
    const {videoId} = req.params;
    const {page =1 ,limit = 10} = req.query;
})


const addComment = asyncHandler(async(req,res)=>{
    //TODO : add comment to a video
})

const updateComment = asyncHandler(async(req,res)=>{
    //TODO : update comment 
})

const deleteComment = asyncHandler(async(req,res)=>{
    //TODO : delete comment 
})

export {getVideoComments, addComment, updateComment, deleteComment}