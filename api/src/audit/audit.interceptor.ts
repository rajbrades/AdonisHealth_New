
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
    constructor(private auditService: AuditService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const method = request.method;
        const url = request.originalUrl;
        const ip = request.ip;

        return next.handle().pipe(
            tap(() => {
                if (user && user.sub) { // Only log if user is authenticated (userId is in sub)
                    // context.getClass().name gives "PatientsController"
                    // context.getHandler().name gives "findAll"
                    const action = `${method} ${context.getClass().name}.${context.getHandler().name}`;
                    this.auditService.logAccess(user.sub, action, url, ip);
                }
            }),
        );
    }
}
