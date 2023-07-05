const dotenv = require("dotenv");
dotenv.config();

const scraperObject = {
  url: `${process.env.FPRX_URL}/i_generatorset.htm`,
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to Generator Related Parameters... `);

    let timer = setTimeout(async () => {
      console.log("Página tardó demasiado en cargar. Refrescando...");
      try {
        await page.goto(this.url, {
          waitUntil: "domcontentloaded",
          timeout: 0,
        });
      } catch (error) {
        console.error("An error occurred while refreshing the page:", error);
  
        await browser.close();
        throw error; 
      }
    }, 30000); // Tiempo máximo de espera antes de refrescar la página en milisegundos

    try {
      await page.goto(this.url, { waitUntil: "domcontentloaded", timeout: 0 });
    } catch (error) {
      console.error("An error occurred while navigating to the page:", error);
      clearTimeout(timer);
      await browser.close();
      throw error;
    }

    clearTimeout(timer);

    const PLdata = await page.evaluate(() => {
      const scriptTag = Array.from(
        document.getElementsByTagName("script")
      ).find((script) => script.innerHTML.includes("PLdata"));

      if (scriptTag) {
        const scriptContent = scriptTag.innerHTML;
        const startIndex = scriptContent.indexOf("PLdata") + "PLdata = ".length;
        const endIndex = scriptContent.indexOf("';", startIndex);
        const PLdata = scriptContent.substring(startIndex, endIndex).trim();

        const PLdataArray = PLdata.replace(/'/g, "").split(";");

        return PLdataArray;
      } else {
        return null;
      }
    });

    // Array de claves
    let keysArray = [
      "WEBGENSET", // "Generator driving functionality"
      "WEBTURNONLVL", // "Turn-ON Level [V]"
      "WEBTURNOFFLVL", // "Turn off Battery Charge Current[A]"
      "WEBFREQUENCY", // "Frequency [days]"
      "WEBSTARTTIME", // "Start Time [hh:mm]"
      "WEBDURATION", // "Duration [h]"
      "WEBGENTEMPSET", // "Generator on High Temperature"
      "WEBTURNONTEMP", // "Turn ON Temperature [°C]"
      "WEBGENERATORTIME", // "Generator time before Alarm [h]"
      "WEBGENTEST", // "Generator Signal Test"
      "WEBTURNOFFTEMP", // "Turn Off Temperature Hysteresis [°C]"
      "WEBACDETTIME", // "AC Detection Time[sec]"
    ];

    // Array de valores

    // console.log(PLdata);
    let keyValuePairs = {};
    for (let i = 0; i < PLdata.length; i++) {
      keyValuePairs[keysArray[i]] = PLdata[i];
    }
    await browser.close();

    return keyValuePairs;
  },
};

module.exports = scraperObject;
