const express = require("express");

const contactsController = require("../../controllers/contacts-controller");
const { schemas } = require("../../models/contact");
const { validateBody } = require("../../decorators");
const { isValidId, authenticate } = require("../../middlewares");

const router = express.Router();

router.get("/", authenticate, contactsController.getAllContacts);

router.get(
  "/:contactId",
  authenticate,
  isValidId,
  contactsController.getContactById
);

router.post(
  "/",
  authenticate,
  validateBody(schemas.contactAddSchema),
  contactsController.addContact
);

router.delete("/:contactId", authenticate, contactsController.removeContact);

router.put(
  "/:contactId",
  authenticate,
  validateBody(schemas.contactAddSchema),
  contactsController.updateContact
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  validateBody(schemas.updateFavoriteSchema),
  contactsController.updateFavoriteContact
);

module.exports = router;
