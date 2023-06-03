const express = require("express");

const { schemas } = require("../../models/user");
const { validateBody } = require("../../decorators");
const ctrl = require("../../controllers/auth");
const { authenticate } = require("../../middlewares");

const router = express.Router();

router.post("/signUp", validateBody(schemas.singUpSchema), ctrl.singUp);

router.post("/signIn", validateBody(schemas.signInSchema), ctrl.singIn);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/signOut", authenticate, ctrl.signOut);

module.exports = router;
