const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

//maybe it does not need it
// const index = require('./routes/index');
// app.use(index);

const server = http.createServer(app);
app.set('io', require('./services/sockeio')(server));

if (process.env.NODE_ENV == 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  app.get('*/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;
server.listen(port, () => console.log('Server listeningn on port: ' + port));
