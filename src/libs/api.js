const crypto = require('crypto');
const Common = require('./common.js').Common;

class API {
 constructor() {
  this.apiMethods = {
   login: this.login
  };
 }

 async processAPI(name, params) {
  //console.log('API request: ', name);
  //console.log('Parameters: ', params);
  const method = this.apiMethods[name];
  if (method) return await method.call(this, params);
  else return { error: 1, message: 'API not found' };
 }

 login(p = {}) {
  const parsedData = new URLSearchParams(p.data);
  const hash = parsedData.get('hash');
  parsedData.delete('hash');
  const dataCheckString = Array.from(parsedData.entries())
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(entry => `${entry[0]}=${entry[1]}`)
  .join('\n');
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(Common.settings.other.bot_token).digest();
  const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  if (calculatedHash === hash) {
   let resData = Object.fromEntries(parsedData);
   resData.user = JSON.parse(resData.user);
   return { error: 0, data: resData }
  } else {
   return { error: 1, message: 'User verification failed' }
  }
 }
}

module.exports = API;
