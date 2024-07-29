const express = require('express');
const router = express.Router();
const { getItems } = require('../controllers/itemController');

router.get('/', async (req, res) => {
    try {
        const items = await getItems();
        res.render('index', { items });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
