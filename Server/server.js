const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const puppeteer = require("puppeteer");
require("dotenv").config();
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 600 }); // Set the cache expiration time in seconds (e.g., 10 minutes)

const app = express();
const PORT = process.env.PORT || 5001;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.get("/api/scrape", async (req, res) => {
  try {
    let keyword = req.query.keyword; // Get the keyword from the query string
    let product = []; // An empty array to store the data
    let seenProducts = {};

    const cacheKey = `search_data_${keyword}`;

    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    // Navigate to the Google Shopping page
    await page.goto(`https://www.google.com/search?q=${keyword}&tbm=shop`);

    while (true) {
      let productsInThisIteration = [];
      try {
        // Scrape products from the current page
        productsInThisIteration = await pageNext(page, seenProducts, cacheKey);

        // Add the products from this iteration to the main product array
        product.push(...productsInThisIteration);

        // Check if there's a "Next" button
        const nextButton = await page.$("#pnnext");
        if (!nextButton) {
          break; // Exit the loop if there's no next page
        }

        // Click the "Next" button and wait for navigation to the next page
        await nextButton.click();
        await page.waitForNavigation();
      } catch (error) {
        console.error("Error in this iteration:", error);
        break; // Exit the loop in case of an error
      }
    }

    await browser.close();
    res.json(product);
  } catch (error) {
    console.error("Overall error:", error);
    res.status(500).json(error.message);
  }
});

async function pageNext(page, seenProducts, cacheKey) {
  await page.waitForSelector("div");

  // Extract product data
  const products = await page.$$("div");

  const cachedData = myCache.get(cacheKey);
  if (cachedData) {
    console.log("Using cached data for key:", cacheKey);
    return cachedData;
  }

  const productsInThisIteration = [];

  for (const productElement of products) {
    try {
      const productName = await productElement.$eval(
        ".tAxDx",
        (a) => a.innerText
      );
      const productPrice = await productElement.$eval(
        ".shntl",
        (span) => span.innerText
      );
      const image = await productElement.$eval(".ArOc1c img", (img) => {
        return img.getAttribute("src");
      });

      const priceMatch = productPrice.match(/₹([\d,.]+)/);

      if (productName && priceMatch && image) {
        const extractedPrice = priceMatch[1].replace(/,/g, "");
        const productItem = {
          name: productName,
          price: extractedPrice,
          image,
        };

        // Check if the product name is already seen
        if (!seenProducts[productName]) {
          seenProducts[productName] = true;
          productsInThisIteration.push(productItem);
        }
      }
    } catch (error) {
      console.error("Error in this product:", error);
    }
  }

  myCache.set(cacheKey, productsInThisIteration);

  return productsInThisIteration;
}

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
