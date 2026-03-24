import { asyncHandler }  from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const verifyJWT = asyncHandler(async(req,res,next)=>{
    const authHeader = req.cookies?.accessToken || req.headers?.authorization?.replace("Bearer ","");

    if(!authHeader){
        throw new ApiError(401,"Unauthorized");
    }
    try {
        const decoded = jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded?._id).select("-password -refreshToken");
        if(!user){
            throw new ApiError(401,"Unauthorized");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401,"Invalid access token");
    }
    });
