import chromium from "chrome-aws-lambda";

const delay = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

// const browser = await puppeteer.launch( { args: ['--no-sandbox'] } );
const run = async (url, selector, timeDelay, attributePath) => {
  const browser = await chromium.puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  await page.goto(url);
  await delay(timeDelay);
  const imageurl = await page.evaluate(
    ({ selector, attributePath }) => {
      const item = document.querySelector(selector);
      if (attributePath) {
        return eval(`item.${attributePath}`);
      } else {
        return item.innerHTML;
      }
    },
    {
      selector,
      attributePath,
    }
  );
  browser.close();
  return {
    imageurl,
  };
};

export default function handler(req, res) {
  const { url, selector, timeDelay, attributePath } = req.body;
  const resp = await run(url, selector, timeDelay, attributePath);
  res.status(200).json({
    body: resp,
  });
}
