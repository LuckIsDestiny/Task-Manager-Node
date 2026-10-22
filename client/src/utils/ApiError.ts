type ZodErrorType = { field: string; message: string };

export class ApiError extends Error {
  public statusCode: number;
  public errors?: ZodErrorType[];
  constructor(message: string, statusCode: number, errors?: ZodErrorType[]) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    if (errors) {
      this.errors = errors;
    }
  }
}
