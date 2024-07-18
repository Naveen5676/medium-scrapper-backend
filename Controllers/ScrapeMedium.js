const puppeteer = require("puppeteer");
require('dotenv').config();

async function scrapeMedium(topic) {
  const browser = await puppeteer.launch({ 
    args:[
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath: process.env.NODE_ENV === "production" ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
    headless: true });
  let articles = [];

  try {
    const page = await browser.newPage();

    await page.goto(`https://medium.com/search?q=${topic}`, {
      waitUntil: "networkidle2",
    });

    // Ensure the page has loaded and the articles are available
    await page.waitForSelector("article", { timeout: 50000 });

    articles = await page.evaluate(() => {
      const articleElements = document.querySelectorAll("article");
      const articlesData = [];

      articleElements.forEach((article) => {
        const title = article.querySelector("h2")?.innerText || "";
        const author = article.querySelector(".lx.l p.be.b.ik.z.ee.hl.ef.eg.eh.ei.ej.ek.bj")?.innerText || "";
        let date = "";

        // First attempt to get date using the primary selector
        const primaryDateElement = article.querySelector(
          ".nj.nk.nl.nm.nn.no.np.nq.nr.ns.l > span.be.b.ik.z.fd > div.hw.ab.fv.ae > div.ab.q"
        );
        if (primaryDateElement) {
          date = primaryDateElement.innerText.split("\n")[0].trim();
        } else {
          // Fallback method to get date
          const elements = article.getElementsByClassName("be b ik z fd");
          if (elements.length > 0) {
            const dateElement = elements[0].querySelector("span");
            date = dateElement?.innerText.trim() || "";
          }
        }

        const url = article.querySelector('div[role="link"]')?.getAttribute("data-href") || "";
        const imgSrc = article.querySelector('img[width="160"]')?.getAttribute("src") || "";

        articlesData.push({ title, author, date, url, imgSrc });
      });

      return articlesData.slice(0, 5);
    });
  } catch (error) {
    console.error("Error during scraping:", error);
  } finally {
    await browser.close();
  }

  return articles;
}

exports.GetData = async (req, res, next) => {
  try {
    const input = req.body.input;
    console.log(input);
    const articles = await scrapeMedium(input);
    console.log("Article data:", articles);
    return res.status(200).json({ success: "True", articles });
  } catch (err) {
    console.error("Error in GetData:", err);
    return res.status(500).json({ success: "False", message: `Internal Server Error : ${err} ` });
  }
};
