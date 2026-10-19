import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
//Read the token from the endpoint
//check if the token is valid
export const authMiddleware = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookie;
  }

  if (!token) {
    return res.status(401).json({ error: "Not authoraized" });
  }

  try {
    //verify tokeny validity
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decode.id },
    });

    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: `Not authorized: ${error.message}` });
  }
};
