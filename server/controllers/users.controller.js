import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplete.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import forgotPasswordTemplate from "../utils/forgotPasswordtemplate.js";
import generateOtp from "../utils/genrateOtp.js"; 
import jwt from "jsonwebtoken";


//register email controller
export async function registeruserController(request, response) {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({
        message: "Please provide name, email, and password",
        error: true,
        success: false,
      });
    }
     const strongPasswordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");

    if (!strongPasswordRegex.test(password)) {
      return response.status(400).json({
        message: "Password is not strong enough. It must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.",
        error: true,
        success: false,
      });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return response.status(400).json({
        message: "Email is already registered",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      status: "ACTIVE"
    });

    const savedUser = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${savedUser._id}`;

    await sendEmail({
      sendTo: email,
      subject: "Verify your email - NMart",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    return response.status(201).json({
      message: "User registered successfully",
      error: false,
      success: true,
      data: savedUser,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

//verify email controller
export async function verifyEmailController(request, response) {
  try {
    const { code } = request.body;
    const user = await UserModel.findOne({ _id: code });
    if (!user) {
      return response.status(400).json({
        message: "Invalid code",
        error: true,
        success: false
      });
    }
    await UserModel.updateOne({ _id: code }, {
      verify_email: true
    });
    return response.json({
      message: "Verify email done",
      error: false,
      success: true
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true
    });
  }
}
//login controller
export async function loginController(request, response) {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).json({
        message: "Provide a password",
        error: true,
        success: false
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return response.status(400).json({
        message: "User is not registered",
        error: true,
        success: false
      });
    }

    if (user.status !== "ACTIVE") {
      return response.status(400).json({
        message: "Contact to the admin",
        error: true,
        success: false
      });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
      return response.status(400).json({
        message: "Check your password",
        error: true,
        success: false
      });
    }

    const accesstoken = await generateAccessToken(user._id);
    const refreshtoken = await generateRefreshToken(user._id);

    const updateUser= await UserModel.findByIdAndUpdate(user?._id,{
      last_login_date:new Date()
    })

    const cookieOption = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None"
    };

    response.cookie('accessToken', accesstoken, cookieOption);
    response.cookie('refreshToken', refreshtoken, cookieOption);

    return response.json({
      message: "Login Successfully",
      error: false,
      success: true,
      data: { accesstoken, refreshtoken }
    });

  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: true,
      success: false
    });
  }
}
//logout controller
export async function logoutController(request, response) {
  try {
    const userId= request.userId
    const cookieOption = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None"
    };
    response.clearCookie("accessToken", cookieOption);
    response.clearCookie("refreshToken", cookieOption);
    const removeRefreshToken = await UserModel.findByIdAndUpdate(userId,{
      refresh_token:""
    })
    return response.json({
      message: "logout successfully",
      error: false,
      success: true
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}
// upload user avtar
export async  function uploadAvatar(request,response){
    try {
        const userId = request.userId // auth middlware
        const image = request.file  // multer middleware

        const upload = await uploadImageCloudinary(image)
        
        const updateUser = await UserModel.findByIdAndUpdate(userId,{
            avatar : upload.url
        })

        return response.json({
            message : "upload profile",
            success : true,
            error : false,
            data : {
                _id : userId,
                avatar : upload.url
            }
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


//update user details
export async function updateUserDetails(request,response) {
  try {
    const userId = request.userId //auth middleware
    const {name,email,mobile,password}=request.body
    let hashedPassword =""
    if(password){
      const salt = await bcryptjs.genSalt(10);
      hashedPassword = await bcryptjs.hash(password, salt);
    }
    const updateUser = await UserModel.updateOne({_id:userId},{
      ...(name && { name: name}),
      ...(email && { email: email}),
      ...(mobile && {mobile : mobile}),
      ...(password && { password: password}),
    })
    return response.json({
      message:"Update User Successfully",
      error: false,
      success: true,
      data: updateUser
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
  
}
//forgot password
export async function forgotpasswordController(request, response) {
  try {
    let { email } = request.body;

    if (!email) {
      return response.status(400).json({
        message: "Email is required",
        error: true,
        success: false
      });
    }

    email = email.trim().toLowerCase();
    const user = await UserModel.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    console.log("🔍 Looking for:", email);
    console.log("👤 Found user:", user);

    if (!user) {
      return response.status(400).json({
        message: "Email not available",
        error: true,
        success: false
      });
    }

    const otp = generateOtp();
    const expireTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: expireTime.toISOString()
    });

    await sendEmail({
      sendTo: email,
      subject: "Forgot password from SMart",
      html: forgotPasswordTemplate({
        name: user.name,
        otp: otp
      })
    });

    return response.json({
      message: "Check your email",
      error: false,
      success: true
    });

  } catch (error) {
    console.error("forgotpasswordController error:", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}


// verify forgot password
 export async function verifyForgotPasswordOtp(request,response) {
  try {
    const {email,otp}=request.body
    const user = await UserModel.findOne({email})
    if(!user){
      return response.status(400).json({
        message:"Email not Availavle",
        error:true,
        success:false
      })
    }
    const currentTime= new Date().toISOString
    if (user.forgot_password_expiry < currentTime) {
       return response.status(400).json({
        message:"OTP Exipre",
        error:true,
        success: true
       })    
    }
    if(otp !== user.forgot_password_otp){
      return response.status(400).json({
        message:"OTP Invalid",
        error:true,
        success:false
      })
    }
    const updateUser= await UserModel.findByIdAndUpdate(user?._id,{
      forgot_password_expiry:"",
      forgot_password_otp:""
    })
    return response.json({
      message:"Verify successfully",
      error:false,
      success: true
    })
  } catch (error) {
    return response.status(500).json({
      message:error.message |error,
      error:true,
      success:false
    })
  }
 }
 //reset the  password
 export async function resetPassword(request,response) {
  try {
    const { email, newPassword, confirmPassword}= request.body
    if(!email || !newPassword ||!confirmPassword){
      return response.status(400).json({
        message:"provide required feilds email,new password, confirm password"
      })
    }
    const user = await UserModel.findOne({email})
    if (!user) {
      return response.status(400).json({
        message:"Email is not Available",
        error:true,
        success:false
      })
    }
    if(newPassword !== confirmPassword){
      return response.status(400).json({
        message:"newPassword and confirmPassword not the same",
        error:true,
        success:false
      })
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);  
    const update = await UserModel.findOneAndUpdate(user._id,{
      password:hashedPassword
    })
    return response.json({
      message:"Password update successfully.",
      error:false,
      success:true
    })
  } catch (error) {
     return response.status(500).json({
      message: error.message ||error,
      error: true,
      sucess: false
     })
  }
 }
 //refresh token controller
export async function refreshToken(request, response) {
  try {
    const refreshToken =
      request.cookies?.refreshToken ||
      request.headers?.authorization?.split(" ")[1];

    if (!refreshToken) {
      return response.status(401).json({
        message: "Invalid token",
        error: true,
        success: false
      });
    }

    const verifyToken = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);

    if (!verifyToken?.id) {
      return response.status(401).json({
        message: "Token is expired or invalid",
        error: true,
        success: false
      });
    }

    const newAccessToken = generateAccessToken({ id: verifyToken.id });

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    };

    response.cookie('accessToken', newAccessToken, cookieOption);

    return response.json({
      message: "New Access token received",
      success: true,
      error: false,
      data: {
        accesstoken: newAccessToken
      }
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false
    });
  }
}
//get login user details
export async function userDetails (request, response) {
  try {
    const userId=request.userId
    const user = await UserModel.findById(userId).select('-password -refresh_token')
    return response.json({
      message:'User Details',
      data:user,
      error:false,
      success:true

    })
  } catch (error) {
    return response.status(500).json({
      message:"something is wrong",
      error:true,
      success:false
    })
  }
}
