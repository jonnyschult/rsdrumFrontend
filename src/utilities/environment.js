let APIURL = '';

switch (window.location.hostname) {
  case 'localhost' || '127.0.0.1':
    APIURL = 'http://localhost:4040';
    break;
  case 'ridgestreetstudios.com':
    APIURL = 'https://api.rsdrum.com';
    break;
  default:
    APIURL = 'https://api.rsdrum.com';
}

export default APIURL;
