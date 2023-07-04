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
    if (postParams.hasOwnProperty(key)) {
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
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = postSystemRelatedParameters;
