
import { UsuarioLoginResponse } from "./Usuario-Login-Response,model";

import { PersonaResponse } from "./persona-response.model";
import { RolResponse } from "./rol-response.model";

export class LoginResponse {
    success: boolean=false;
    mensaje: string="";
    token: string="";
    usuario: UsuarioLoginResponse= new UsuarioLoginResponse;
    rol: RolResponse = new RolResponse;
    persona: PersonaResponse = new PersonaResponse;
}
