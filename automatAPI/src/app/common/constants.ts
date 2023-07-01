export const functionNamePythonRegex = new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$');

export const functionNameJSRegex = new RegExp('^[a-zA-Z_$][0-9a-zA-Z_$]*$');

export const endpointRegex = new RegExp('^\/?[a-z]([a-z0-9_]*)(\/[a-z:][a-z0-9-_]+)*$');

export const hostRegex = new RegExp(
  '^(([0-9])|([1-9][0-9])|(1([0-9]{2}))|(2[0-4][0-9])|(25[0-5]))((.(([0-9])|([1-9][0-9])|(1([0-9]{2}))|(2[0-4][0-9])|(25[0-5]))){3})$'
);

export const databaseRegEx = new RegExp('^[a-zA-Z][a-zA-Z0-9_]{0,127}$');

export const passwordRegex = new RegExp(
  '^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*_])[a-zA-Z0-9!@#$%^&*_]{8,20}$'
);

export const nameRegEx = new RegExp('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$');

export const usernameRegex = new RegExp('^[a-zA-Z0-9_.]+$');
