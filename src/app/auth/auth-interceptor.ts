import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth';

// Interceptor que agrega el token JWT a TODAS las peticiones HTTP
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyectamos el servicio de autenticación
  const authService = inject(AuthService);
  
  // Obtenemos el token del localStorage
  const token = authService.getToken();

  // Si hay token, lo agregamos al header Authorization
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  // Si no hay token, dejamos pasar la petición normal
  return next(req);
};
