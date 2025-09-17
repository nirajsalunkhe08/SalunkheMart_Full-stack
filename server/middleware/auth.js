import jwt from 'jsonwebtoken';

const auth = async (request, response, next) => {
  try {
    const token =
      request.cookies?.accessToken ||
      (request.headers.authorization && request?.headers?.authorization?.split(" ")[1]);

    if (!token) {
      return response.status(401).json({
        message: "Plaese login to access this page",
        error: true,
        success: false
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    if (!decoded) {
      return response.status(401).json({
        message: "Unauthorized access",
        error: true,
        success: false
      });
    }

    request.userId = decoded.id || decoded.userId;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return response.status(500).json({
      message: "You have not login",
      error: true,
      success: false
    });
  }
};

export default auth;
