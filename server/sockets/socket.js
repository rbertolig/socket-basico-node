//=================================
// Implementacion de los sockets
//=================================

//importar io desde server.js declarado alla con 'module.exports'
const { io } = require('../server');

//para capturtar el evento cuando se conectan ( reconectan ) clientes remotos al socket se usa: el tag 'connection'
io.on('connection', (client) => {
    // toda la comunicacion se implementa dentro de un lazo 'io.on()'
    console.log('Cliente remoto ON-LINE'); // confirmar conexion de nuevo cliente
    // para enviar mensajes de un lado a otro se usa: 'client.emit()'
    // que puede tener 3 argumentos: 'tagClave', 'objeto con payload', 'funcion callback'
    client.emit('enviarMensaje', {
        usuario: 'Administrador',
        mensaje: 'Bienvenido a esta aplicacion'
    }); // a este no se le puso el callback

    //capturar cuando un cliente se desconecta del servidor
    // esto escucha el 'tag' reservado 'disconnect'
    client.on('disconnect', () => {
        console.log('Cliente remoto OFF-LINE');
    });

    // capturar mensaje enviados por clientes remotos conectados a un socket
    // este usa en el lado servidor y es el complemento para los 'socket.emit()' del lado cliente 
    // parametro1: 'tags' predefinidos capturados por el servicio; en este ejemplo se usa: 'enviarMensaje'
    // parametro2: el mensaje que se recibe en objeto 'payload'
    // parametro3: es una funcion callback que nos pasa el cliente dentro del mismo socket.emit()
    // para que la llamemos como forma de realimentar que el payload fue recibido y la forma en que se resolvio
    client.on('enviarMensaje', (payload, callback) => {
        console.log('Mensaje recibido:', payload);

        //'client.emit()' del lado servidor responde al mismo usuario de envio el ultimo mensaje recibido de este
        client.emit('enviarMensaje', payload);

        //parahacer un broadcast de un mensaje a todos los clientes remotos conectados usar
        client.broadcast.emit('enviarMensaje', payload);

        // en este ejemplo validaremos si el objeto recibido ('payload') contiene la llave: 'usuario'
        //la validacion se hace devolviendo una respuesta dentro del callback que espera socketIO.emit() del lado cliente
        if (!callback) return; // evitar que ocurra error si mensaje del cliente no se hizo con callback
        // si el cliente remoto envio mensaje con peticion de confirmacion en 'callback' en parametro 3 entonces:
        if (payload.usuario) {
            callback({
                resp: 'El mensaje contiene la llave: usuario' // validacion positiva
            });
        } else {
            callback({
                resp: 'ATENCION!El mensaje NO contiene la llave: usuario' // validacion negativa
            });
        }
    });
});