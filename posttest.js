const puppeteer = require('puppeteer');

async function capturePost() {
  const browser = await puppeteer.launch({ headless: false }); // Modo no oculto para que puedas rellenar el formulario manualmente
  const page = await browser.newPage();

  // Activa la intercepción de solicitudes
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

  // Navega a la página web la cual quedara abierta permanentemente para capturara los post hata que se cierre el navegador                                
  await page.goto('http://root:default@192.168.88.200', {timeout: 0}); // Reemplaza con la URL de la página que contiene el formulario

  // No esperes a que se complete la solicitud POST. En lugar de eso, mantén el script en ejecución.
  // await page.waitForResponse(response => response.request().method() === 'POST');
}

capturePost();
