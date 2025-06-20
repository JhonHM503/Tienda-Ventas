import Swal from "sweetalert2";



export function convertToBoolean(input: string): boolean {
    try {
        return JSON.parse(input.toLowerCase());
    }
    catch (e){
        return false;
    }
}



export function alert_success(title:string, text: string){
    Swal.fire({
         icon: 'success',
        title: title,
        text: text,
        showCancelButton: false,
        timer: 1500,
        // timer: timer == null || timer == undefined ? 1500 : timer,
    });
}


// export function alert_warning(title:string, text:string){
//     Swal.fire({
//         icon:'warning',
//         title:title,
//         text:text,
//         position:'top-end',
//         showCancelButton:false,
//         // timer: timer == null || timer == undefined ? 3000 : timer,
//     });
// }

export function alert_error(title:string, text:string){
    Swal.fire({
        icon:'error',
        title:title,
        text:text, 
        showCancelButton:false,
        // timer: timer == null || timer == undefined ? 3000 : timer,
    });
    
}

// Función para mostrar una alerta de confirmación antes de eliminar un registro
export function alert_confirm_delete(title: string, text: string) {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });
}

// Función para mostrar una alerta de éxito después de eliminar un registro
export function alert_delete_success(title: string, text: string) {
    Swal.fire({
        icon: 'success',
        title: title,
        text: text,
        showCancelButton: false,
        timer: 1500,
    });
}

// Función para mostrar una alerta de error si la eliminación falla
export function alert_delete_error(title: string, text: string) {
    Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        showCancelButton: false,
    });
}


export function alert_login_success(title: string, text: string) {
    return Swal.fire({
        icon: 'success',
        title: title,
        text: text,
        confirmButtonText: 'OK',
        customClass: {
            confirmButton: 'btn btn-primary'
        },
          buttonsStyling: true,
        backdrop: true,
        allowOutsideClick: false,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    });
}

export function alert_login_error(title: string, text: string) {
    return Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        confirmButtonText: 'OK',
        customClass: {
            confirmButton: 'btn btn-danger'
        },
        buttonsStyling: true
    });
}