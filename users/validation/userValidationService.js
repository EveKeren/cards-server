import userSchema from "./userValidationSchema.js";
import Joi from "joi";

export const validateUser = (user) => {
  return userSchema.validate(user);
};

export const validateUserLogin = (user) => {
  const loginSchema = Joi.object({
    email: Joi.string()
      .ruleset.pattern(
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
      )
      .rule({ message: 'user "email" must be a valid email' })
      .required(),
    password: Joi.string().min(7).max(20).required(),
  });
  return loginSchema.validate(user);
};

export const validateUserUpdate = (user) => {
  const updateSchema = Joi.object({
    name: Joi.object()
      .keys({
        first: Joi.string().min(2).max(256).required(),
        middle: Joi.string().min(0).max(256).allow(""),
        last: Joi.string().min(2).max(256).required(),
      })
      .required(),
    phone: Joi.string()
      .ruleset.regex(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)
      .rule({ message: 'user "phone" must be a valid phone number' })
      .required(),
    email: Joi.string()
      .ruleset.pattern(
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
      )
      .rule({ message: 'user "email" must be a valid email' })
      .required(),
    image: Joi.object()
      .keys({
        url: Joi.string().allow(""),
        alt: Joi.string().min(2).max(256).allow(""),
      })
      .required(),
    address: Joi.object()
      .keys({
        state: Joi.string().min(0).max(256).allow(""),
        country: Joi.string().min(2).max(256).required(),
        city: Joi.string().min(2).max(256).required(),
        street: Joi.string().min(2).max(256).required(),
        houseNumber: Joi.number().required(),
        zip: Joi.number().allow(""),
      })
      .required(),
  });
  return updateSchema.validate(user);
};
