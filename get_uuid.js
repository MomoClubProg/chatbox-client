const os = require('node:os');
const md5 = require('md5');

class UUID {

  static get(username = '') {
    let sum = '';
    let net_if = os.networkInterfaces();
    delete net_if['lo'];

    Object.values(net_if).forEach(x => {
      x.forEach(addr => {
        sum += addr.mac + ':' + username + ':'
      })
    });
    return md5(sum);
  }
}

module.exports = UUID;
