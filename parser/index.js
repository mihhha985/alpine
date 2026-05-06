const fs = require("node:fs/promises");
const path = require("node:path");
const puppeteer = require("puppeteer");
const { imageSize } = require("image-size");
const { BRAND_DATA, COLOR_DATA, SIZE_DATA } = require("./data");

const TARGET_URL =
  "https://www.lamoda.ru/c/4154/default-kids/?is_new=1&sitelink=topmenuK&l=2";
const PRODUCT_LIMIT = 38;
const CATEGORY_ID = 5; //kids
const SUB_CATEGORY_ID = 1; //odezhda
const OUTPUT_ROOT = path.join(process.cwd(), "products", "kids", "odezhda");
const MIN_IMAGE_WIDTH = 500;
const MIN_IMAGE_HEIGHT = 500;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sampleRandom(items, count) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

function getRandomIdFromData(data) {
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex].id;
}

function getRandomBrandId() {
  return getRandomIdFromData(BRAND_DATA);
}

function getRandomColorIds(min = 1, max = 2) {
  const targetLength = Math.floor(Math.random() * (max - min + 1)) + min;
  const pickedColors = sampleRandom(
    COLOR_DATA,
    Math.min(targetLength, COLOR_DATA.length)
  );
  return {
    connect: pickedColors.map((item) => ({ documentId: item.documentId })),
  };
}

function getRandomSizeIds(min = 3, max = 5) {
  const targetLength = Math.floor(Math.random() * (max - min + 1)) + min;
  const pickedSizes = sampleRandom(
    SIZE_DATA,
    Math.min(targetLength, SIZE_DATA.length)
  );
  return {
    connect: pickedSizes.map((item) => ({ documentId: item.documentId })),
  };
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeImageUrl(url) {
  if (!url || typeof url !== "string") {
    return null;
  }
  if (url.startsWith("//")) {
    return `https:${url}`;
  }
  return url;
}

function getExtensionFromUrl(url) {
  try {
    const parsed = new URL(url);
    const ext = path.extname(parsed.pathname);
    if (ext && ext.length <= 5) {
      return ext;
    }
  } catch (_) {
    // no-op
  }
  return ".jpg";
}

async function downloadImageIfLargeEnough(url, filePath) {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const dimensions = imageSize(buffer);
  const width = dimensions?.width ?? 0;
  const height = dimensions?.height ?? 0;

  if (width < MIN_IMAGE_WIDTH || height < MIN_IMAGE_HEIGHT) {
    return false;
  }

  await fs.writeFile(filePath, buffer);
  return true;
}

async function collectProductLinks(page) {
  const links = new Set();

  for (let i = 0; i < 10; i += 1) {
    const chunk = await page.evaluate(() => {
      const anchors = [...document.querySelectorAll("a[href*='/p/']")];
      return anchors.map((a) => a.href);
    });

    for (const link of chunk) {
      try {
        const url = new URL(link);
        url.search = "";
        url.hash = "";
        links.add(url.toString());
      } catch (_) {
        // skip invalid links
      }
    }

    if (links.size >= PRODUCT_LIMIT * 2) {
      break;
    }

    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight * 2);
      const loadMoreButton = [...document.querySelectorAll("button")].find((btn) =>
        /Показать еще|Показать ещё|Ещё товары|Еще товары/i.test(btn.textContent || "")
      );
      if (loadMoreButton) {
        loadMoreButton.click();
      }
    });

    await delay(1800);
  }

  return [...links];
}

async function extractProductData(page) {
  return page.evaluate(() => {
    const parseJsonLd = () => {
      const scripts = [...document.querySelectorAll("script[type='application/ld+json']")];
      const parsed = [];
      for (const script of scripts) {
        try {
          const value = JSON.parse(script.textContent || "{}");
          parsed.push(value);
        } catch (_) {
          // ignore malformed json-ld
        }
      }
      return parsed.flatMap((entry) => (Array.isArray(entry) ? entry : [entry]));
    };

    const ldItems = parseJsonLd();
    const product = ldItems.find((item) => {
      const type = item?.["@type"];
      if (Array.isArray(type)) {
        return type.includes("Product");
      }
      return type === "Product";
    });

    const title =
      product?.name ||
      document.querySelector("meta[property='og:title']")?.getAttribute("content") ||
      document.querySelector("h1")?.textContent?.trim() ||
      "";

    const description =
      product?.description ||
      document.querySelector("meta[name='description']")?.getAttribute("content") ||
      document.querySelector("meta[property='og:description']")?.getAttribute("content") ||
      "";

    const rawPrice =
      product?.offers?.price ||
      document.querySelector("meta[property='product:price:amount']")?.getAttribute("content") ||
      document.querySelector("[itemprop='price']")?.getAttribute("content") ||
      "";

    const numericPrice = Number(
      String(rawPrice)
        .replace(",", ".")
        .replace(/[^\d.]/g, "")
    );

    const ldImages = product?.image
      ? Array.isArray(product.image)
        ? product.image
        : [product.image]
      : [];

    const domImages = [
      ...new Set(
        [...document.querySelectorAll("img[src], img[data-src], img[srcset]")]
          .flatMap((img) => {
            const src = img.getAttribute("src") || "";
            const dataSrc = img.getAttribute("data-src") || "";
            const srcset = img.getAttribute("srcset") || "";
            const srcsetUrls = srcset
              .split(",")
              .map((part) => part.trim().split(" ")[0])
              .filter(Boolean);
            return [src, dataSrc, ...srcsetUrls].filter(Boolean);
          })
          .filter((url) => /lmcdn|product|gallery|img/i.test(url))
      ),
    ];

    const ogImage = document
      .querySelector("meta[property='og:image']")
      ?.getAttribute("content");

    return {
      title,
      description,
      price: Number.isFinite(numericPrice) ? numericPrice : 0,
      images: [...new Set([...ldImages, ogImage, ...domImages])].filter(Boolean),
    };
  });
}

async function main() {
  await fs.rm(OUTPUT_ROOT, { recursive: true, force: true });
  await fs.mkdir(OUTPUT_ROOT, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
    );
    await page.goto(TARGET_URL, { waitUntil: "domcontentloaded", timeout: 120000 });
    await delay(2500);

    const allLinks = await collectProductLinks(page);
    if (allLinks.length === 0) {
      throw new Error("Не удалось собрать ссылки на товары.");
    }

    const selectedLinks = sampleRandom(allLinks, Math.min(PRODUCT_LIMIT, allLinks.length));
    console.log(`Найдено ссылок: ${allLinks.length}. Выбрано: ${selectedLinks.length}.`);

    for (let i = 0; i < selectedLinks.length; i += 1) {
      const productNumber = i + 1;
      const productUrl = selectedLinks[i];
      const productDir = path.join(OUTPUT_ROOT, String(productNumber));
      const imageDir = path.join(productDir, "img");

      await fs.mkdir(imageDir, { recursive: true });

      const productPage = await browser.newPage();
      await productPage.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
      );

      try {
        await productPage.goto(productUrl, { waitUntil: "domcontentloaded", timeout: 120000 });
        await delay(1500);

        const scraped = await extractProductData(productPage);
        const imageUrls = unique(scraped.images.map(normalizeImageUrl)).filter((url) =>
          /^https?:\/\//i.test(url)
        );

        const payload = {
          data: {
            Title: (scraped.title || "").trim(),
            Description: (scraped.description || "").trim(),
            Price: Number((scraped.price || 0).toFixed(2)),
            Badge: i % 2 === 0 ? "новая коллекция" : "эксклюзив",
            category: CATEGORY_ID,
            sub_category: SUB_CATEGORY_ID,
            brand: getRandomBrandId() - 1,
            colors: getRandomColorIds(),
            sizes: getRandomSizeIds(),
          },
        };

        await fs.writeFile(
          path.join(productDir, "data.json"),
          `${JSON.stringify(payload, null, 2)}\n`,
          "utf8"
        );

        let downloadedCount = 0;
        for (let imgIndex = 0; imgIndex < imageUrls.length; imgIndex += 1) {
          const imageUrl = imageUrls[imgIndex];
          const extension = getExtensionFromUrl(imageUrl);
          const imagePath = path.join(imageDir, `${imgIndex + 1}${extension}`);
          try {
            const isSaved = await downloadImageIfLargeEnough(imageUrl, imagePath);
            if (isSaved) {
              downloadedCount += 1;
            }
          } catch (error) {
            // Пропускаем недоступные картинки и продолжаем сбор.
          }
        }

        console.log(
          `#${productNumber}: сохранен товар (${payload.data.Title || "без названия"}), фото: ${downloadedCount}`
        );
      } catch (error) {
        console.error(`#${productNumber}: ошибка при обработке ${productUrl}`, error.message);
      } finally {
        await productPage.close();
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error("Puppeteer parse failed:", error);
  process.exit(1);
});
