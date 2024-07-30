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
            const priceBigInt = variation && variation.itemVariationData.priceMoney ? variation.itemVariationData.priceMoney.amount : 0n;
            const price = Number(priceBigInt); // Explicit conversion to Number
            const gtin = variation && variation.itemVariationData.upc ? variation.itemVariationData.upc : null;
            const sku = variation && variation.itemVariationData.sku ? variation.itemVariationData.sku : 'N/A';

            return {
                id: item.id,
                name: item.itemData.name,
                description: item.itemData.description,
                price: price / 100, // Convert cents to dollars
                barcode: sku, // Use GTIN if available, otherwise use SKU
            };
        });
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};

module.exports = { getItems };
