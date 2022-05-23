import Joi from "joi";

const userValidate = (data) => {
  const userSchema = Joi.object({
    username: Joi.string().email().pattern(new RegExp("gmail.com$")).lowercase().required(),
    password: Joi.string().min(4).max(32).required(),
  });

  return userSchema.validate(data);
};

export { userValidate };
