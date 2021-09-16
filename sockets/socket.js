const { io } = require('../index');


// Mensajes de Sockets
io.on('connection', client => {
  console.log('Cliente conectado');

  client.on('disconnect', () => {
    console.log('Cliente desconectado');
  });

  client.on('emit_message', (payload) => {
    client.broadcast.emit("new_message", payload)
  });


});
