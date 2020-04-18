export default function validarCrearCuenta(valores) {
    let errores = {};

    // Validar el nombre del usuario
    if (!valores.nombre) {
        errores.nombre = 'El nombre es obligatorio'
    }

    if (!valores.empresa) {
        errores.empresa = 'El nombre de empresa es obligatorio'
    }

    if (!valores.url) {
        errores.url = 'La url es obligatoria';
    } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
        errores.url = "URL mal formateada o no válida" 
    }

    // Validar descripcion
if(!valores.descripcion){
    errores.descripcion="Agrega una descripcion a tu producto"
}
    return errores;

}