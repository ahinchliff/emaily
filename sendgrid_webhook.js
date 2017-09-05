var localtunnel = require('localtunnel');
localtunnel(5000, { subdomain: 'qazplmqazppp' }, function(err, tunnel) {
  console.log('LT running')
});