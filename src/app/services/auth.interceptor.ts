import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { alert_error } from '../functions/general.functions';
import { AuthStateService } from '../modulos/auth/service/AuthStateService.service';

interface ErrorResponse {
  success: boolean;
  codigo: string;
  descripcion: string;
  mensaje: string;
  mensajeSistema: string;
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router:Router,
    private authStateService: AuthStateService // Inyectar el servicio
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
     // No aplicar el token si la solicitud es para ImgBB
    if (req.url.includes('api.imgbb.com')) {
      return next.handle(req);
    }



    let token=sessionStorage.getItem("token");
    //obtesnemos otra vaarialbes

     // DEBUG: Agregar log para verificar si el token existe
     if (token) {
      console.log('🔑 Token encontrado para la petición:', req.url);
    } else {
      console.log('❌ No hay token para la petición:', req.url);
    }

    //SIMULAR LOS ERRORES
    let request=req;
    if(token){
      request=req.clone
      (
        {
          setHeaders:{
              authorization: `Bearer ${token}`
          }
        }
      );
    }
   
    
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log('Error response',err.error)
        console.log('❌ Error status:', err.status);
        console.log('❌ Error URL:', req.url);

        let errorResponse: ErrorResponse = err.error;
        let title: string = "Error en el servidor";
        let message: string = "Comuníquese con el área de sistemas";

        if (errorResponse && errorResponse.codigo) {
          // Si la respuesta tiene la estructura esperada, usa esos datos
          title = errorResponse.descripcion;
          message = errorResponse.mensaje;
        } else {
          // Si no, usa el manejo de errores por defecto basado en el código de estado
          switch(err.status) {
            case 400:
              title = "ERROR DEL BAD REQUEST";
              message = "DATOS ENVIADOS INCORRECTOS";
              break;
            case 401:
              title = "SU SESIÓN HA CADUCADO";
              message = "VUELVA A REALIZAR EL LOGIN";
              this.router.navigate(['']);
              break;
            case 403:
              title = "PERMISOS INSUFICIENTES";
              message = "Coordine con su administrador";
              break;
            case 404:
              title = "RECURSO NO ENCONTRADO";
              message = "";
              break;
            case 500:
              // Este caso ahora será manejado por la respuesta personalizada
              break;
            case 0:
              title = "OCURRIÓ UN ERROR";
              message = "No podemos comunicarnos con el servicio";
              break;
            default:
              title = "ERROR NO CONTROLADO";
              message = "Ocurrió un error inesperado";
              break;
          }
        }

         // Solo mostrar la alerta si no es un error 401 (para evitar múltiples alertas)
         if (err.status !== 401) {
          alert_error(title, message);
        }

        return throwError(() => err);
      })
    );
  }
}
