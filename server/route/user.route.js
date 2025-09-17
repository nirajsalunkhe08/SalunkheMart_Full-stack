import { Router } from "express";
import multer from "multer";
import {
  loginController,
  logoutController,
  registeruserController,
  uploadAvatar,
  verifyEmailController,
  updateUserDetails,
  forgotpasswordController,
  verifyForgotPasswordOtp,
  resetPassword,
  refreshToken,
  userDetails

} from "../controllers/users.controller.js";
import auth from "../middleware/auth.js";

const storage = multer.memoryStorage(); // adjust as needed
const upload = multer({ storage });
const userRouter = Router();

userRouter.post("/register", registeruserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginController);
userRouter.get("/logout", auth, logoutController);
userRouter.put("/upload-avatar", auth, upload.single('avatar'), uploadAvatar); // fixed
userRouter.put("/update-user",auth,updateUserDetails)
userRouter.put("/forgot-password",forgotpasswordController);
userRouter.put("/verify-forgot-password-otp",verifyForgotPasswordOtp)
userRouter.put("/reset-password",resetPassword)
userRouter.post("/refresh-token",refreshToken)
userRouter.get("/user-details",auth,userDetails)
export default userRouter;

