const axios = require('axios');
const querystring = require('querystring');
const dotenv = require('dotenv');
dotenv.config();

const postSystemRelatedParameters = async (params) => {
  console.log(params);
  // Define los parámetros de la solicitud POST
  let postParams = {
    WEBSBC: '', // This parameter seems to be empty in your original code
    WEBNOMOV: params.WEBNOMOV, // 'Nominal Output Voltage'
    WEBCCL: params.WEBCCL, // 'Charge Current Limit'
    WEBBATDISV: params.WEBBATDISV, // 'Battery Disconnect Voltage'
    WEBBATRECV: params.WEBBATRECV, // 'Battery Reconnect Voltage'
    WEBBATLOWVA: params.WEBBATLOWVA, // 'Battery Low Voltage Alarm'
    WEBBATLOWVW: params.WEBBATLOWVW, // 'Battery Low Voltage Warning'
    WEBBTD: params.WEBBTD, // 'Battery Temperature Alarm High'
    WEBBTDLOW: params.WEBBTDLOW, // 'Battery Temperature Alarm Low'
    WEBSBCT: params.WEBSBCT, // 'Initial Charge Time'
    WEBCT: params.WEBCT, // 'Charge Time'
    WEBBCT: params.WEBBCT, // 'Boost Charge Time'
    WEBSEI: params.WEBSEI, // 'System Efficiency Improvement'
    WEBTSM: params.WEBTSM, // 'Temperature Sensor Shelf A'
    WEBTSSA: params.WEBTSSA, // 'Temperature Sensor Shelf B'
    WEBTSSB: params.WEBTSSB, // 'Temperature Sensor Shelf C'
  }

  // Verifica que los datos no estén vacíos o nulos
  for (const key in postParams) {
    if (postParams.hasOwnProperty(key) && key !== "WEBSBC" && key !== "WEBSEI"&& key !== "WEBTSM"&& key !== "WEBTSSA" && key !== "WEBTSSB") {
      const element = postParams[key];
      if (element === "" || element === null) {
        console.log("Error: " + key + " is empty or null");
        return "Error: " + key + " is empty or null";
      }
    }
  }

  // Realiza la solicitud POST si todos los datos son válidos
  try {
    const response = await axios.post(`${process.env.FPRX_URL}/i_sysrelparam.htm`, querystring.stringify(postParams));
    console.log(response.status);
    return response.status;
  } catch (error) {
    if (error.response) {
      // El servidor respondió con un estado fuera del rango de 2xx
      console.error('Error de respuesta del servidor', error.response.status);
      console.error('Datos de error', error.response.data);
      console.error('Cabeceras de error', error.response.headers);
      throw { message: error.message, status: error.response.status };
  } else if (error.request) {
      // La solicitud se hizo pero no se recibió ninguna respuesta
      console.error('No se recibió ninguna respuesta', error.request);
      throw { message: error.message, status: 307 }; // Usar un 307 Temporary Redirect si no hay respuesta
  } else {
      // Algo sucedió en la configuración de la solicitud que desencadenó un error
      console.error('Error de configuración', error.message);
      throw { message: error.message, status: 300 }; // Usar un 300 Multiple Choices si hay un problema de configuración
  }
  }
}

module.exports = postSystemRelatedParameters;
