'use strict';
const Hapi = require('hapi');
const server = new Hapi.Server({ port: 8080, host: '0.0.0.0' });
const Good = require('good');
async function start() {

    try {
        await server.start();
    } 
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();
 

async function liftOff () {
const plugin=require('./api/routes/routes')

  try {
    await server.register(plugin); 

  } catch (e) {
    console.log(e);
  }

}
liftOff()
