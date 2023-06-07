const express = require("express");

const { schemas } = require("../../models/user");
const { validateBody } = require("../../decorators");
const ctrl = require("../../controllers/auth");
const { authenticate, upload } = require("../../middlewares");

const router = express.Router();

router.post("/signUp", validateBody(schemas.singUpSchema), ctrl.signUp);

router.get("/verify/:verificationToken", ctrl.verify);

router.post("/verify", validateBody(schemas.verifySchema), ctrl.resendVerify);

router.post("/signIn", validateBody(schemas.signInSchema), ctrl.signIn);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/signOut", authenticate, ctrl.signOut);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

module.exports = router;
