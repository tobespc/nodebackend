require('appmetrics-dash').attach();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const serverPort = 9096;
const server = app.listen(serverPort, () => console.log(`Tobes server listening on port ${serverPort}!`))
const utils = require('./utils');
var items;
var needRefresh = true;

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/health', (req, res) => res.json({ status: 'UP' }));

app.get('/tobes', (req, res) => res.send('Hello Tobes!'));

app.get('/api/v1/items', async function (req, res) {
  
   if (!needRefresh) {
     res.status(200).send(items);
     return;
    } 

  const options = {
      hostname: 'docker.for.mac.localhost',
      port: 32796,
      path: '/api/v1/items',
      method: 'GET'
  }
 
  const response = await utils.asyncHttpRequest(options, null, this.secure);
  switch (response.statusCode){
    case 200:
      items = response.body;
      needRefresh = false;
      res.status(200).send(items);
      break;
    default:
      console.error('error');
      res.status(response.statusCode).send(response.statusCode);
      break;
  }
});