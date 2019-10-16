import cookie from 'react-cookie';

var token = cookie.load("access_token");
var bearerToken = 'Bearer ' + token;

export default bearerToken;