import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import {Video} from "../models/video.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";    
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { upload } from "../middlewares/multer.middleware.js";

const getAllVideos = asyncHandler(async(req,res)=>{
    const {page =1 ,limit = 10,query,sortBy,sortType,userId} = req.query;
    //TODO : get all videos based on query, sort and pagination

})

const publishVideo = asyncHandler(async(req,res)=>{
    const {title,description} = req.body;
    //TODO : get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async(req,res)=>{
    //TODO : get video by id
})

const UpdateVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    //TODO : update video by id
})

export {getAllVideos, publishVideo, getVideoById, UpdateVideo}