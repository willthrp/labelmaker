const express = require('express');
const router = express.Router();
const { getItems } = require('../controllers/itemsController');
const bwipjs = require('bwip-js');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/api/search', async (req, res) => {
    try {
        const searchQuery = req.query.q.toLowerCase();
        const items = await getItems();
        const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchQuery));
        res.json(filteredItems);
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).send('Server Error');
    }
});

router.get('/print', async (req, res) => {
    try {
        const queue = JSON.parse(req.query.queue);
        const items = await Promise.all(queue.map(async item => {
            const barcodeData = await bwipjs.toBuffer({
                bcid: 'code128',       // Barcode type
                text: item.barcode,    // Text to encode
                scale: 3,              // 3x scaling factor
                height: 10,            // Bar height, in millimeters
                includetext: true,     // Show human-readable text
                textxalign: 'center',  // Always good to set this
            });
            const barcodeBase64 = `data:image/png;base64,${barcodeData.toString('base64')}`;

            return {
                ...item,
                barcode: barcodeBase64,
                logo: `/path/to/custom/logos/${item.id}.png`  // Path to custom logo
            };
        }));
        res.render('print', { items });
    } catch (err) {
        console.error('Error rendering print page:', err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
