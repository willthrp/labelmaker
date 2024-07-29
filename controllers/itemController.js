const { Client, Environment } = require('square');
require('dotenv').config();

const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: Environment.Production, // Change to Environment.Production if needed
});

const getItems = async () => {
    try {
        const response = await client.catalogApi.searchCatalogItems({
            limit: 100, // Adjust the limit as needed
        });
        const items = response.result.items || []; // Ensure items is an array

        return items.map(item => {
            const variation = item.itemData.variations[0];
            const sku = variation && variation.itemVariationData.sku ? variation.itemVariationData.sku : 'N/A';
            const gtin = variation && variation.itemVariationData.upc ? variation.itemVariationData.upc : 'N/A';
            const price = variation && variation.itemVariationData.priceMoney ? variation.itemVariationData.priceMoney.amount : 0;
            return {
                id: item.id,
                name: item.itemData.name,
                price: Number(price) / 100, // Explicit conversion to Number
                gtin: gtin,
                sku: sku,
            };
        });
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};

module.exports = { getItems };
