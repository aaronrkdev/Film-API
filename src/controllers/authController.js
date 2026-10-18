import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  //check if user already exist
  const userExist = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExist) {
    return res.status(400).json({ error: "User already exist" });
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create the user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  //generate token
  const token = generateToken(user.id);

  res.status(201).json({
    status: "success",
    data: {
      id: user.id,
      name,
      email,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  //Check if the user email exist in the table
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  //verify the password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  //generate token
  const token = generateToken(user.id);

  res.status(200).json({
    status: "success",
    data: {
      id: user.id,
      email: user.email,
    },
    token,
  });
};

export { register, login };
