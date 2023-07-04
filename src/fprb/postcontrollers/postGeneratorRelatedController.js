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
    const response = await axios.post(
      "http://root:default@192.168.88.200/i_generatorset.htm",
      querystring.stringify(postParams)
    );
    console.log(response.status);
    return response.status;
  } catch (error) {
    console.log(error);
    return {error, status: error.response?.status};
  }
};

module.exports = postGeneratorParameters;
