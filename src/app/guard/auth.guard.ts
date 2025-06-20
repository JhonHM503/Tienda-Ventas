import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  
  // debugger;

  let token = sessionStorage.getItem("token");
  if (!token)
  {
    alert("guard ==> no inicias sesión")
    // REDIRIGIR AL USUSARIO HACIA LA PANTALLA DE LOGIN
    return false;
  }


  return true;
};
