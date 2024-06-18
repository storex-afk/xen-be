import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('global');
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const statusCode: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message: string =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    this.logger.error(
      `error message => ${message}, trace => ${exception.stack}`,
    );
    response.status(status).json({
      statusCode: statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Oops! Something went wrong. Please try again',
      error: message,
    });
  }
}
