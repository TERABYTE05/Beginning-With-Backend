import { Router } from "express";
import { getAllVideos, publishVideo, getVideoById, UpdateVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(verifyJWT);
router.route("/").get(getAllVideos).post(upload.single("video"),publishVideo);
router.route("/:videoId").get(getVideoById).patch(upload.single("video"),UpdateVideo);

export default router;
