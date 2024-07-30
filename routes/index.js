const express = require('express');
const router = express.Router();
const { getItems } = require('../controllers/itemsController');

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

router.get('/print', (req, res) => {
    res.render('print');
});

module.exports = router;
