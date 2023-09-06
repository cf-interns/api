//import "./string.extensions";

export const toSuccessCreatedResponse = (
  data: any,
  message: string,
  code: string
) => {
  return {
    created: true,
    message: message,
    code: code,
  };
};

export const toSuccessResponseOK = (message: string, code: any) => {
  return {
    statusCode: code,
    message: message,
  };
};

export const toSuccessResponse = (data: any, message: string, code: any) => {
  return {
    message: message,
    code: code,
    data: data,
  };
};

export const tuSuccessCreatedResponse = (message: string, code: any) => {
  return {
    created: true,
    message: message,
    code: code,
  };
};

export const toError = (message: string, code: string, statusCode: number) => {
  return {
    statusCode,
    message,
    code,
  };
};
