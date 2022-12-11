import * as Joi from 'joi';

export const createSchema = Joi.object().keys({
  title: Joi.string().min(3).required(),
  description: Joi.string().allow(''),
  authors: Joi.string().min(2).required(),
  favorite: Joi.string().allow(''),
  fileCover: Joi.string().allow(''),
  fileName: Joi.string().allow(''),
  fileBook: Joi.string().allow(''),
});
