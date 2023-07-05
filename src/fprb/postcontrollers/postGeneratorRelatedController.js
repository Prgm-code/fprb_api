const axios = require("axios");
const querystring = require("querystring");

const postGeneratorParameters = async (params) => {
  console.log(params);
  // Define los parámetros de la solicitud POST
  let postParams = {
    WEBGENSET: params.WEBGENSET, // 'Generator driving functionality'
    WEBTURNONLVL: params.WEBTURNONLVL, // 'Turn-on level'
    WEBTURNOFFLVL: params.WEBTURNOFFLVL, // 'Turn off battery charge current'
    WEBACDETTIME: params.WEBACDETTIME, // 'AC detection time'
    WEBGENTEST: params.WEBGENTEST, // 'Start generator signal test'
    WEBFREQUENCY: params.WEBFREQUENCY, // 'Scheduled generator frequency'
    WEBSTARTTIME: params.WEBSTARTTIME, // 'Scheduled start time'
    WEBDURATION: params.WEBDURATION, // 'Scheduled duration'
    WEBGENTEMPSET: params.WEBGENTEMPSET, // 'Generator on high temperature'
    WEBTURNONTEMP: params.WEBTURNONTEMP, // 'Turn on temperature'
    WEBTURNOFFTEMP: params.WEBTURNOFFTEMP, // 'Turn off temperature hysteresis'
    WEBGENERATORTIME: params.WEBGENERATORTIME, // 'Generator time before alarm'
  };

  // Verifica que los datos no estén vacíos o nulos y formatea ciertos valores si es necesario
  for (const key in postParams) {
    if (postParams.hasOwnProperty(key)) {
      let element = postParams[key];
      if (element === "" || element === null) {
        console.log("Error: " + key + " is empty or null");
        return "Error: " + key + " is empty or null";
      }
      
      // Si key es  'WEBTURNOFFLVL' o 'WEBDURATION' y su valor es menor a 10, formatea el valor para que tenga un cero al inicio y dos decimales
      if (( key === "WEBTURNOFFLVL" || key === "WEBDURATION") && parseFloat(element) < 10) {
        element = parseFloat(element).toFixed(2);
        element = element < 0 ? element : "0" + element;
        postParams[key] = element;
      }
    }
  }

  // Realiza la solicitud POST si todos los datos son válidos
  try {
    const response = await axios.post(`${process.env.FPRX_URL}/i_generatorset.htm`,
      querystring.stringify(postParams)
    );
    console.log('Post Generator Status',response.status);
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
};

module.exports = postGeneratorParameters;
