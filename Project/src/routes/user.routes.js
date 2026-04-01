import { Router } from "express";
import { registerUser,loginUser,logoutUser,refreshAccesToken, changeCurrentUserPassword, getCurrentUserDetails, updateCurrentUserDetails, UpdateUserAvatar, UpdateUserCoverImage, getUserChannelProfile, GetWatchHistory } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
    upload.fields([{ name: "avatar", maxCount: 1 },{
        name: "coverImage", maxCount: 1
    }]),
    registerUser
);

router.route("/login").post(loginUser);

//secured routes

router.route("/logout").post(verifyJWT,logoutUser);

router.route("/refresh-token").post(verifyJWT,refreshAccesToken);
router.route("/change-password").post(verifyJWT,changeCurrentUserPassword);
router.route("/current-user").get(verifyJWT,getCurrentUserDetails);
router.route("/update-account").patch(verifyJWT,updateCurrentUserDetails);
router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),UpdateUserAvatar);
router.route("/update-cover").patch(verifyJWT,upload.single("coverImage"),UpdateUserCoverImage);
router.route("/c/:username").get(getUserChannelProfile);
router.route("/history").get(verifyJWT,GetWatchHistory);
//router.route("/login").post(login);
export default router;
