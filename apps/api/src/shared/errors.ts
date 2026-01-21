/**
 * HTTP Status Codes Enum
 *
 * Commonly used HTTP status codes for API responses
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

/**
 * Base application error class
 *
 * Extends Error with HTTP status code for API responses
 */
export class AppError extends Error {
  constructor(
    public override message: string,
    public statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * 404 Not Found error
 *
 * Used when a requested resource does not exist
 */
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * 400 Validation error
 *
 * Used when input validation fails
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * 401 Unauthorized error
 *
 * Used when authentication is required but missing or invalid
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, HttpStatus.UNAUTHORIZED);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * 403 Forbidden error
 *
 * Used when the user is authenticated but doesn't have permission
 */
export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, HttpStatus.FORBIDDEN);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * 409 Conflict error
 *
 * Used when the request conflicts with existing data
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * 422 Unprocessable Entity error
 *
 * Used when the request is well-formed but contains semantic errors
 */
export class UnprocessableEntityError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
    Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
  }
}
