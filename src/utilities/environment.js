let APIURL = ''

switch (window.location.hostname) {
  case 'localhost' || '127.0.0.1':
    APIURL = 'http://localhost:4040'
    break
  case 'ridgestreetstudios.com':
    APIURL = 'https://ridgestreetstudiosserver.herokuapp.com'
    break
  default:
    APIURL = ''
}

export default APIURL
