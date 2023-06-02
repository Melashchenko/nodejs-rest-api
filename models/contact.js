const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Set owner for contact"],
    },
  },
  { versionKey: false, timestamps: true }
);

const contactAddSchema = Joi.object({
  name: Joi.string()

    .min(3)
    .max(30)
    .required()
    .messages({ "any.required": `missing required name field` }),
  email: Joi.string()

    .required()
    .messages({ "any.required": `missing required email field` }),
  phone: Joi.string()
    .required()

    .messages({ "any.required": `missing required phone field` }),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

contactSchema.post("save", handleMongooseError);

const Contact = model("contact", contactSchema);

const schemas = {
  contactAddSchema,
  updateFavoriteSchema,
};

module.exports = {
  Contact,
  schemas,
};
