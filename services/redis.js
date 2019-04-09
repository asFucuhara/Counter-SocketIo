const redis = require('redis-node');
const { promisify } = require('util');

const client = redis.createClient();

const counters = {};

client.on('error', function(err) {
  console.log('Error ' + err);
});

client.on('connect', () => console.log('Redis is Ready'));

const getAsync = promisify(client.get).bind(client);

const getCounter = (room, callback) => {
  console.log('get room:', room);
  getAsync(room).then(counter => {
    console.log('get resp:', counter);
    callback(counter, room);
  });
};

const setCounter = (room, number = 0, callback) => {
  console.log(`set ${room} to ${number}`);
  client.set(room, number);
  callback();
};

const changeRoom = room => {
  console.log(`Change to ${room}: ${counters[room]}`);
  if (counters[room]) {
    console.log('room alredy exist');
    return room;
  } else {
    console.log('Generating Room');
    client.set(room, 0);
    counters[room] = {};
    counters[room].interval = setInterval(() => client.incr(room), 1000);
    
    return room;
  }
};

module.exports = { getCounter, setCounter, changeRoom };
