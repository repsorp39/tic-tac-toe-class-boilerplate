const Joi = require("joi");

const playerSchema = Joi.object({
  email: Joi.string().email().required(),
  pseudo: Joi.string().required(),
  password: Joi.string().required().min(8),
});

module.exports = { playerSchema };
