const fs = require("node:fs/promises");
const path = require("node:path");
require("dotenv").config();

const API_BASE_URL = "http://localhost:1337";
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/api/products`;
const UPLOAD_ENDPOINT = `${API_BASE_URL}/api/upload`;
const STRAPI_REF = "api::product.product";
const DATA_ROOT = path.join(process.cwd(), "products", "kids", "odezhda");
const API_TOKEN = process.env.API_TOKEN;

console.log(DATA_ROOT);

function getAuthHeaders() {
  if (!API_TOKEN) {
    return {};
  }
  return { Authorization: `Bearer ${API_TOKEN}` };
}

async function getAvailableProducts() {
  const entries = await fs.readdir(DATA_ROOT, { withFileTypes: true });
  const directories = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  const available = [];

  for (const dir of directories) {
    const productDir = path.join(DATA_ROOT, dir);
    const dataPath = path.join(productDir, "data.json");
    const imgDir = path.join(productDir, "img");

    try {
      await fs.access(dataPath);
      await fs.access(imgDir);
      available.push({ dir, productDir, dataPath, imgDir });
    } catch (_) {
      // Пропускаем неполные директории.
    }
  }

  return available;
}

async function createProduct(productData) {
  const response = await fetch(PRODUCTS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ data: productData }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ошибка создания продукта: HTTP ${response.status} ${errorText}`);
  }

  const body = await response.json();
  const productId = body?.data?.id;
  if (!productId) {
    throw new Error("API не вернул id созданного продукта.");
  }

  return { productId, body };
}

function pickRandomItem(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

async function uploadImageToField(productId, imgPath, fieldName) {
  const buffer = await fs.readFile(imgPath);
  const fileName = path.basename(imgPath);
  const formData = new FormData();
  formData.append("files", new Blob([buffer]), fileName);
  formData.append("ref", STRAPI_REF);
  formData.append("refId", String(productId));
  formData.append("field", fieldName);

  const response = await fetch(UPLOAD_ENDPOINT, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Ошибка загрузки ${fileName} в поле ${fieldName}: HTTP ${response.status} ${errorText}`
    );
  }
}

async function uploadImageToProduct(productId, imgPath) {
  await uploadImageToField(productId, imgPath, "Images");
}

async function uploadMainImageToProduct(productId, imagePaths) {
  const pickedImage = pickRandomItem(imagePaths);
  if (!pickedImage) {
    return null;
  }
  await uploadImageToField(productId, pickedImage, "MainImg");
  return pickedImage;
}

async function main() {
  const products = await getAvailableProducts();
  if (products.length === 0) {
    throw new Error(`Нет данных для отправки в ${DATA_ROOT}`);
  }

  let createdProducts = 0;
  let uploadedImages = 0;

  for (const product of products) {
    try {
      const rawData = await fs.readFile(product.dataPath, "utf8");
      const parsed = JSON.parse(rawData);
      const productPayload = parsed?.data;

      if (!productPayload || typeof productPayload !== "object") {
        throw new Error(`Некорректный формат data.json: ${product.dataPath}`);
      }

      const { productId } = await createProduct(productPayload);
      createdProducts += 1;
      console.log(`Создан продукт id=${productId} из папки ${product.dir}`);

      const allImages = (await fs.readdir(product.imgDir, { withFileTypes: true }))
        .filter((entry) => entry.isFile())
        .map((entry) => path.join(product.imgDir, entry.name))
        .filter((filePath) => /\.(jpg|jpeg|png|webp|gif)$/i.test(filePath));

      if (allImages.length === 0) {
        console.log(`У товара ${product.dir} нет подходящих изображений для загрузки.`);
      }

      try {
        const mainImagePath = await uploadMainImageToProduct(productId - 1, allImages);
        if (mainImagePath) {
          console.log(`Главное фото (${product.dir}): ${path.basename(mainImagePath)}`);
        }
      } catch (error) {
        console.error(error.message);
      }

      let productUploadedCount = 0;
      for (const imgPath of allImages) {
        try {
          await uploadImageToProduct(productId - 1, imgPath);
          productUploadedCount += 1;
          uploadedImages += 1;
          console.log(`Загружено фото для ${product.dir}: ${path.basename(imgPath)}`);
        } catch (error) {
          console.error(error.message);
        }
      }

      console.log(
        `Товар ${product.dir} обработан. Загружено изображений: ${productUploadedCount}/${allImages.length}`
      );
    } catch (error) {
      console.error(`Ошибка при обработке товара ${product.dir}: ${error.message}`);
    }
  }

  console.log(`Готово. Создано товаров: ${createdProducts}/${products.length}. Загружено фото: ${uploadedImages}`);
}

main().catch((error) => {
  console.error("Отправка данных завершилась с ошибкой:", error.message);
  process.exit(1);
});
