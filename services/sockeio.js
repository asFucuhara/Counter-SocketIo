const socketIo = require('socket.io');

const { getCounter, setCounter, changeRoom } = require('./redis');

module.exports = server => {
  const io = socketIo(server);

  io.on('connection', socket => {
    console.log('New client connected');
    let currentRoom = changeRoom('global');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });

    socket.on('changeRoom', room => {
      console.log('aaah', room);
      currentRoom = changeRoom(room);
      socket.emit('roomChanged', room);
    });

    socket.on('setCouter', data => {
      console.log(data);
      contador = data;
      setCounter(currentRoom, data, console.log);
    });

    const interval = setInterval(() => {
      getCounter(currentRoom, counter => socket.emit('update', counter));
    }, 800);
  });
  return io;
};
