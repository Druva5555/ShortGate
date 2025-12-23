import Joi from 'joi';

export const createUrlSchema = Joi.object({
  body: Joi.object({
    url: Joi.string().uri({ scheme: [/https?/] }).required(),
    alias: Joi.string()
      .pattern(/^[a-zA-Z0-9_-]{4,30}$/)
      .optional(),
    expiresInDays: Joi.number().integer().min(1).max(365).optional(),
  }),
});
