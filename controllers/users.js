const { prisma } = require("../prisma/prisma-client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ========LOGIN=========
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in the required fields" });
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    // 123123
    const isPasswordCorrect =
      user && (await bcrypt.compare(password, user.password));

    const secret = process.env.JWT_SECRET;

    if (user && isPasswordCorrect && secret) {
      res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        token: jwt.sign({ id: user.id }, secret, { expiresIn: "30d" }),
      });
    } else {
      return res
        .status(400)
        .json({ message: "Incorrect login or password entered" });
    }
  } catch(error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// ========REGISTER=========

/**
 *
 * @rout POST /api/user/register
 * @desc Регистрация
 * @accsess Public
 */

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Please fill in the required fields" });
    }

    const registeredUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (registeredUser) {
      return res
        .status(400)
        .json({ message: "A user with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const secret = process.env.JWT_SECRET;

    if (user && secret) {
      return res.status(201).json({
        id: user.id,
        email: user.email,
        name,
        token: jwt.sign({ id: user.id }, secret, { expiresIn: "30d" }),
      });
    } else {
      return res.status(400).json({ message: "Failed to create user" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// ========CURRENT=========

/**
 *
 * @rout GET /api/user/current
 * @desc Текущий пользователь
 * @accsess Privat
 */

const current = async (req, res) => {
  return res.status(200).json(req.user);
};

module.exports = {
  login,
  register,
  current,
};
