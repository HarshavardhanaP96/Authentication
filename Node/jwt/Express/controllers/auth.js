import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { genSalt } from "bcrypt";
import sendVerificationEmail from "./emailVerify.js";
import User from "../models/user.js";

const secret = "NLJDLJNdsldm&^%&3543&Y";

const signup = async function (req, res) {
  const { username, name, email, ph_number, password } = req.body;

  try {
    console.log("1");

    let user = await User.findOne({
      $or: [{ email }, { username }, { ph_number }],
    });
    console.log("2");

    if (user) {
      return res
        .status(400)
        .json({ message: "User with this email already exist" });
    }
    console.log("1");

    const salt = await genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    console.log("salt password");

    const emailverificationToken = crypto.randomBytes(32).toString("hex");
    console.log(emailverificationToken);

    user = await User.create({
      username,
      email,
      ph_number,
      name,
      password: passwordHash,
      emailverificationToken,
    });

    sendVerificationEmail(user, emailverificationToken);

    return res.status(200).json({ message: "user created successfully" });
  } catch (err) {
    return res.status(500).json({ message: "server encounterd an error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User Not Found. Kindly SignUp" });
    }

    const salt = await genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const isMatch = await bcrypt.compare(passwordHash, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ userEmail: user.email }, secret, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export { signup, login };
