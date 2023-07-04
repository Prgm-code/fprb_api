const axios = require('axios');
const querystring = require('querystring');

// Define los parámetros de la solicitud POST
let postParams = {
    WEBSBC: '',
    WEBNOMOV: '-54.72',
    WEBCCL: '17',
    WEBBATDISV: '-43.00',
    WEBBATRECV: '-46.30',
    WEBBATLOWVA: '-46.30',
    WEBBATLOWVW: '-49.00',
    WEBBTD: '30',
    WEBBTDLOW: '-5',
    WEBSBCT: '24',
    WEBCT: '24',
    WEBBCT: '0'
  }
  

axios.post('http://root:default@192.168.88.200/i_sysrelparam.htm', querystring.stringify(postParams))
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error);
  });