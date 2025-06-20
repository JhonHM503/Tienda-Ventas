import { PersonaResponse } from "src/app/models/persona-response.model";
import { RolResponse } from "src/app/models/rol-response.model";
import { UsuarioLoginResponse } from "src/app/models/Usuario-Login-Response,model";

export class RegisterResponse {
    success: boolean=false;
    mensaje: string="";
    token: string="";
    tokenExpira: string="";
    usuario: UsuarioLoginResponse=new UsuarioLoginResponse ;
    rol: RolResponse=new RolResponse;
    persona: PersonaResponse=new PersonaResponse;
}