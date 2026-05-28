import Joi from 'joi';

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errorMessages
    });
  }
  
  next();
};

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(2).max(100).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const sendOtpSchema = Joi.object({
  phone: Joi.string().min(10).max(15).required()
});

export const verifyOtpSchema = Joi.object({
  phone: Joi.string().min(10).max(15).required(),
  otp_code: Joi.string().length(6).required()
});

export const verifyEmailSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required()
});

export const resendVerificationSchema = Joi.object({
  email: Joi.string().email().required()
});

export const createBookingSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  serviceId: Joi.number().integer().required(),
  address: Joi.string().min(10).required(),
  bookingDate: Joi.date().iso().required(),
  partIds: Joi.array().items(Joi.number().integer()).optional()
});

export const estimateSchema = Joi.object({
  serviceId: Joi.number().integer().required(),
  partIds: Joi.array().items(Joi.number().integer()).optional()
});

export const bookServiceSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().min(10).max(15).required(),
  address: Joi.string().min(10).required(),
  service_type: Joi.string().required(),
  preferred_date: Joi.date().iso().required(),
  preferred_time: Joi.string().required(),
  notes: Joi.string().allow('').optional()
});

export const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).max(15).required(),
  message: Joi.string().min(10).required()
});

export const supportSchema = Joi.object({
  user_id: Joi.string().uuid().optional(),
  issue_type: Joi.string().required(),
  message: Joi.string().min(10).required()
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).required()
});
