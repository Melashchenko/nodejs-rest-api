const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");

const { HttpError, avatarSize } = require("../helpers");
const { ctrlWrapper } = require("../decorators");
const { User } = require("../models/user");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const { SECRET_KEY } = process.env;

const signUp = async (req, res, next) => {
  const { email, password } = req.body;
  const emailUnique = await User.findOne({ email });
  if (emailUnique) {
    throw HttpError(409, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const user = await User.create({
    ...req.body,
    password: hashedPassword,
    avatarURL,
  });
  res.status(201).json({
    email: user.email,
    name: user.name,
  });
};

const signIn = async (req, res) => {
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

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tmpUpload, originalname } = req.file;

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  await fs.rename(tmpUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  await avatarSize(resultUpload);

  res.json({
    avatarURL,
  });
};

module.exports = {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
  getCurrent: ctrlWrapper(getCurrent),
  signOut: ctrlWrapper(signOut),
  updateAvatar: ctrlWrapper(updateAvatar),
};
