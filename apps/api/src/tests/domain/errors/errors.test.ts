import { describe, expect, test } from 'bun:test';

import {
  AppError,
  ConflictError,
  ForbiddenError,
  HttpStatus,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError,
  ValidationError,
} from '@/api/domain/erros/errors';

describe('HttpStatus', () => {
  test('should have correct status codes', () => {
    expect(HttpStatus.OK).toBe(200);
    expect(HttpStatus.CREATED).toBe(201);
    expect(HttpStatus.NO_CONTENT).toBe(204);
    expect(HttpStatus.BAD_REQUEST).toBe(400);
    expect(HttpStatus.UNAUTHORIZED).toBe(401);
    expect(HttpStatus.FORBIDDEN).toBe(403);
    expect(HttpStatus.NOT_FOUND).toBe(404);
    expect(HttpStatus.CONFLICT).toBe(409);
    expect(HttpStatus.UNPROCESSABLE_ENTITY).toBe(422);
    expect(HttpStatus.INTERNAL_SERVER_ERROR).toBe(500);
    expect(HttpStatus.SERVICE_UNAVAILABLE).toBe(503);
  });
});

describe('AppError', () => {
  test('should create error with message and default status code', () => {
    const error = new AppError('Test error');

    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(error.name).toBe('AppError');
  });

  test('should create error with custom status code', () => {
    const error = new AppError('Test error', HttpStatus.NOT_FOUND);

    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
  });
});

describe('NotFoundError', () => {
  test('should create error with 404 status code', () => {
    const error = new NotFoundError('Resource not found');

    expect(error.message).toBe('Resource not found');
    expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(error.name).toBe('NotFoundError');
  });
});

describe('ValidationError', () => {
  test('should create error with 400 status code', () => {
    const error = new ValidationError('Invalid input');

    expect(error.message).toBe('Invalid input');
    expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(error.name).toBe('ValidationError');
  });
});

describe('UnauthorizedError', () => {
  test('should create error with 401 status code and default message', () => {
    const error = new UnauthorizedError();

    expect(error.message).toBe('Unauthorized');
    expect(error.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    expect(error.name).toBe('UnauthorizedError');
  });

  test('should create error with custom message', () => {
    const error = new UnauthorizedError('Invalid token');

    expect(error.message).toBe('Invalid token');
    expect(error.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });
});

describe('ForbiddenError', () => {
  test('should create error with 403 status code and default message', () => {
    const error = new ForbiddenError();

    expect(error.message).toBe('Forbidden');
    expect(error.statusCode).toBe(HttpStatus.FORBIDDEN);
    expect(error.name).toBe('ForbiddenError');
  });

  test('should create error with custom message', () => {
    const error = new ForbiddenError('Access denied');

    expect(error.message).toBe('Access denied');
    expect(error.statusCode).toBe(HttpStatus.FORBIDDEN);
  });
});

describe('ConflictError', () => {
  test('should create error with 409 status code', () => {
    const error = new ConflictError('Resource already exists');

    expect(error.message).toBe('Resource already exists');
    expect(error.statusCode).toBe(HttpStatus.CONFLICT);
    expect(error.name).toBe('ConflictError');
  });
});

describe('UnprocessableEntityError', () => {
  test('should create error with 422 status code', () => {
    const error = new UnprocessableEntityError('Invalid entity');

    expect(error.message).toBe('Invalid entity');
    expect(error.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(error.name).toBe('UnprocessableEntityError');
  });
});
