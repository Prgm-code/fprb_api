const scraperObject = {
    url: 'http://root:default@192.168.88.200/',
    async scraper(browser){
        let page = await browser.newPage();
        
        await page.goto(this.url, {waitUntil: 'domcontentloaded'});
        
        await page.setRequestInterception(true);

  page.on('request', interceptedRequest => {
    // Si la solicitud es un POST, captúrala
    if (interceptedRequest.method() === 'POST') {
      console.log('URL:', interceptedRequest.url());
      console.log('Post data:', interceptedRequest.postData());
    }

    // Deja que la solicitud continúe
    interceptedRequest.continue();
  });
        
   
        await browser.close();
    
        
    }
}

module.exports = scraperObject;
