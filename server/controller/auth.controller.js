import { User } from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Agent } from "../model/agents.model.js";

async function register(req, res) {
  try {
    const result = await User.create(req.body);

    return res.status(result.status).json({ message: result.message });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "missing data" });
  }

  try {
    let u = await User.findBy({ email });

    if (!u) {
      return res.status(404).json({ message: "user not found" });
    }

    const { image, ...user } = u;

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(user, process.env.SECRET_KEY);

      return res
        .cookie("token", token, {
          // secure: true
          sameSite: "strict",
          httpOnly: true,
        })
        .status(200)
        .json({ message: "logged in successfully" });
    } else {
      return res.status(403).json({ message: "incorrect email or password" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
}

function logout(req, res) {
  return res
    .clearCookie("token", {
      // secure: true
      sameSite: "strict",
      httpOnly: true,
    })
    .status(200)
    .json({ message: "logged out successfully" });
}

async function registerAgent(req, res) {
  try {
    const result = await Agent.create(req.body);

    return res.status(result.status).json({ message: result.message });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
}

async function loginAgent(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "missing data" });
  }

  try {
    let a = await Agent.findBy({ username });

    if (!a) {
      return res.status(404).json({ message: "agent not found" });
    }

    const { image, ...agent } = a;

    if (await bcrypt.compare(password, agent.password)) {
      const token = jwt.sign(agent, process.env.SECRET_KEY);

      return res
        .cookie("token", token, {
          // secure: true
          sameSite: "strict",
          httpOnly: true,
        })
        .status(200)
        .json({ message: "logged in successfully" });
    } else {
      return res.status(403).json({ message: "incorrect email or password" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
  
}

export { register, registerAgent, login, loginAgent, logout };
