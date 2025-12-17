export const Status = {
  SUCCESS: "SUCCESS",
  MISSING_CREDENTIALS: "MISSING_CREDENTIALS",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  MISSING_EMAIL_PARAM: "MISSING_EMAIL_PARAM",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  MISSING_PARAMS: "MISSING_PARAMS",
  MISSING_STATUS: "MISSING_STATUS",
  INVALID_STATUS: "INVALID_STATUS",
  PROJECT_NOT_FOUND: "PROJECT_NOT_FOUND",
  ERROR: "ERROR",
};

export const ERROR_RESPONSES = {
  [Status.MISSING_CREDENTIALS]: {
    message: "El correo electrónico y la contraseña son obligatorios",
    statusCode: 400,
  },
  [Status.INVALID_CREDENTIALS]: {
    message: "Credenciales inválidas",
    statusCode: 401,
  },
  [Status.MISSING_EMAIL_PARAM]: {
    message: "El parámetro de consulta 'email' es obligatorio",
    statusCode: 400,
  },
  [Status.USER_NOT_FOUND]: {
    message: "Usuario no encontrado",
    statusCode: 404,
  },
  [Status.MISSING_PARAMS]: {
    message: "El correo electrónico, el nombre y el estado son obligatorios",
    statusCode: 400,
  },
  [Status.MISSING_STATUS]: {
    message: "El estado es obligatorio",
    statusCode: 400,
  },
  [Status.INVALID_STATUS]: {
    message: "Valor de estado inválido",
    statusCode: 400,
  },
  [Status.PROJECT_NOT_FOUND]: {
    message: "Proyecto no encontrado",
    statusCode: 404,
  },
  [Status.ERROR]: {
    message: "Error interno del servidor",
    statusCode: 500,
  },
};
