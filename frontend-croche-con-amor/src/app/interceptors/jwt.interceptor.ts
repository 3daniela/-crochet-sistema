import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Adjunta "Authorization: Bearer <token>" a cada request saliente si hay
 * sesión activa. Como la app usa SSR (Angular Universal), localStorage
 * solo existe en el navegador: por eso se verifica isPlatformBrowser
 * antes de tocarlo (en el servidor simplemente no se agrega el header).
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  const token = localStorage.getItem('croche_token');
  const requestClonado = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(requestClonado);
};
