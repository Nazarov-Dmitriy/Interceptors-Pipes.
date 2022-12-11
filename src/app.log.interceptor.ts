import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        console.log(`{
                status: "success",
                data: {
                    method : ${context.getHandler()},
                    class : ${context.getClass()}
                }
            }`);
      }),
      catchError((err) => {
        console.log(`{
            status: "fail",
            data: {
                 Error message: ', ${err}}
                 }`);
        return throwError(() => new InternalServerErrorException());
      }),
    );
  }
}
