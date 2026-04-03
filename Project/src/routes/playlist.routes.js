import { Router } from "express";
import { getAllVideos, publishVideo, getVideoById, UpdateVideo } from "../controllers/playlist.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(verifyJWT);