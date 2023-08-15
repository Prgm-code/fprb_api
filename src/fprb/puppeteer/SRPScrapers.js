const dotenv = require("dotenv");
dotenv.config();

const systemRelatedScraper = {
  url: `${process.env.FPRX_URL}/i_sysrelparam.htm`,
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to System Related Parameters... `);

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

    const labels = [
      "WEBNOMOV", // 'Nominal Output Voltage'
      "WEBCCL", // 'Charge Current Limit'
      "WEBBATDISV", // 'Battery Disconnect Voltage'
      "WEBBATRECV", // 'Battery Reconnect Voltage'
      "WEBBATLOWVA", // 'Battery Low Voltage Alarm'
      "WEBBATLOWVW", // 'Battery Low Voltage Warning'
      "WEBBTD", // 'Battery Temperature Alarm High'
      "WEBBTDLOW", // 'Battery Temperature Alarm Low'
      "WEBSBCT", // 'Initial Charge Time'
      "WEBCT", // 'Charge Time'
      "WEBBCT", // 'Boost Charge Time'
      "WEBSEI", // 'System Efficiency Improvement'
      "WEBTSM", // 'Temperature Sensor Shelf A'
      "WEBTSSA", // 'Temperature Sensor Shelf B'
      "WEBTSSB", // 'Temperature Sensor Shelf C'
    ];

    let result = {};

    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];
      result[label] = PLdata[i];
    }

    await browser.close();

    return result;
  },
};

module.exports = systemRelatedScraper;
