// square.js
const { Client } = require('square');

const client = new Client({
  accessToken: 'YOUR_SQUARE_ACCESS_TOKEN',
  environment: 'sandbox', // or 'production'
});

const inventoryApi = client.inventoryApi;
const catalogApi = client.catalogApi;

async function getInventory() {
  try {
    const response = await catalogApi.listCatalog(undefined, 'ITEM');
    return response.result.objects;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  getInventory,
};
