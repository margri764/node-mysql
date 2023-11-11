import validator from 'express-validator';
const { check, validationResult } = validator;

export const validateUserMiddleware = [
  // Validar userName
  check('userName').isString().withMessage('El campo "userName" es obligatorio y debe ser una cadena.'),

  // Validar password
  check('password').isLength({ min: 8 }).withMessage('El campo "password" es obligatorio y debe tener al menos 8 caracteres.'),

  // Validar email
  check('email').isEmail().withMessage('El campo "email" es obligatorio y debe ser un correo electrónico válido.'),

  // Validar contact_info
  check('contact_info.street_address').exists().isString().withMessage('El campo "street_address" de "contact_info" es obligatorio.'),
  check('contact_info.city').exists().isString().withMessage('El campo "city" de "contact_info" es obligatorio.'),
  check('contact_info.state').exists().isString().withMessage('El campo "state" de "contact_info" es obligatorio.'),
  check('contact_info.postal_code').exists().isString().withMessage('El campo "postal_code" de "contact_info" es obligatorio.'),
  check('contact_info.country').exists().isString().withMessage('El campo "country" de "contact_info" es obligatorio.'),

  // Validar access_permission
  check('access_permission').isIn(['USER_ROLE', 'ADMIN_ROLE', 'SUPER_ROLE']).withMessage('El campo "access_permission" es obligatorio y debe ser una de las opciones permitidas.'),

  // Manejar errores de validación
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Si todas las validaciones son exitosas, continúa al siguiente middleware o controlador
    next();
  }
];


