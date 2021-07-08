let APIURL = '';

switch (window.location.hostname) {
  case 'localhost' || '127.0.0.1':
    APIURL = 'http://localhost:4040';
    break;
  case 'ridgestreetstudios.com':
    APIURL = 'http://rsdrumbackend-env.eba-3aa4vtmm.us-east-2.elasticbeanstalk.com/';
    break;
  default:
    APIURL = 'http://rsdrumbackend-env.eba-3aa4vtmm.us-east-2.elasticbeanstalk.com/';
}

export default APIURL;
