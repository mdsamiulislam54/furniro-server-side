import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
console.log('middleware',token)
  if (!token) {
    return res.status(401).json({ message: "Unauthorized " });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden " });
    }

    req.decode = decode;
    console.log(decode)
    next();
  });
};
