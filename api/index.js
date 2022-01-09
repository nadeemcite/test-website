import chromium from "chrome-aws-lambda";

const delay = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

// const browser = await puppeteer.launch( { args: ['--no-sandbox'] } );
const getImage = async (url, timeDelay) => {
  const browser = await chromium.puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });
  const context = await browser.createIncognitoBrowserContext();
  const page = await browser.newPage();
  await page.goto(url);
  await delay(timeDelay);
  const image = await page.screenshot();
  context.close();
  return image;
};

export default function handler(req, res) {
    getImage(req.body.url,req.body.timeDelay ).then(image => {
        res.setHeader('Content-Type', 'image/png');
        res.send(image);
      })
}
