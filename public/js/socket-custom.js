//=======================================================
// script para comunicacion con el servidor.
// contiene codigo para usar del lado 'cliente remoto'
//=======================================================

// levantar un socket desde este cliente hacia el servidor usando el servicio 'io'
// primero: definir objeto para el socket
var socket = io();

// abrir conexion a travez del socket
socket.on('connect', function() {
    //confirmar en consola la conexion establecida 
    console.log('Servidor: ON-LINE');
});

//capturar perdida de conexion con el servidor de esta manera
socket.on('disconnect', function() {
    //confirmar en consola la conexion perdida 
    console.log('Servidor: OFF-LINE');
});

//enviar informacion del cliente al servidor
// se usa socket.emit() y se envian 3 argumentos:
// primero: un tag o palabra clave prestablecida por mi como parte del protocolo de comunicacion
// segundo: un objeto que es el 'payload' o contenido de la informacion trasmitida
// tercero: una funcion callback que se activara para capturar respuesta del servidor que todo se realizo ok
socket.emit('enviarMensaje', { // 'enviarMensaje' es el tag del protocolo implementado en nuestra app
    usuario: 'Rodolfo',
    mensaje: 'Hola Mundo'
        // capturar 'resp' que es enviada por el servidor luego de recibir este mensaje
}, function(resp) {
    console.log(resp);
});

//escuchar informacion enviada por el servidor del lado cliente
// se usa socket.on() y se captura el tag y un objeto con la info
socket.on('enviarMensaje', (mensaje) => {
    console.log('Mensaje recibido:', mensaje);
});