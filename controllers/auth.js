const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { HttpError } = require("../helpers");
const { ctrlWrapper } = require("../decorators");
const { User } = require("../models/user");

const { SECRET_KEY } = process.env;

const singUp = async (req, res, next) => {
  const { email, password } = req.body;
  const emailUnique = await User.findOne({ email });
  if (emailUnique) {
    throw HttpError(409, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ ...req.body, password: hashedPassword });
  res.status(201).json({
    email: user.email,
    name: user.name,
  });
};

const singIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user.id, { token });

  res.json({
    token,
  });
};

const getCurrent = async (req, res) => {
  const { email, name } = req.user;

  res.json({
    email,
    name,
  });
};

const signOut = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).end();
};

module.exports = {
  singUp: ctrlWrapper(singUp),
  singIn: ctrlWrapper(singIn),
  getCurrent: ctrlWrapper(getCurrent),
  signOut: ctrlWrapper(signOut),
};
