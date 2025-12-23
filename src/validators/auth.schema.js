import Joi from 'joi';

export const registerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().max(100).allow('', null),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
  }),
});

export const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
  }),
});
