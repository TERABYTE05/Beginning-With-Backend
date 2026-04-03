import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import {Playlist} from "../models/playlist.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";    
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { upload } from "../middlewares/multer.middleware.js";


const createPlaylist = asyncHandler(async(req,res)=>{
    const {title,description} = req.body;
    //TODO : create a playlist for a user
})

const getUserPlaylists = asyncHandler(async(req,res)=>{
    const {userId} = req.params;
    //TODO : get all playlists for a user
})

const getPlaylistById = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params;
    //TODO : get playlist by id
})

const addVideoToPlaylist = asyncHandler(async(req,res)=>{
    const {playlistId,videoId} = req.params;
    //TODO : add video to playlist
})

const removeVideoFromPlaylist = asyncHandler(async(req,res)=>{
    const {playlistId,videoId} = req.params;
    //TODO : remove video from playlist
})

const deletePlaylist = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params;
    //TODO : delete playlist by id
})

export {createPlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist}