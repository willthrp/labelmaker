const express = require('express');
const { getInventory } = require('../square');

const router = express.Router();

router.get('/label', async (req, res) => {
  try {
    const items = await getInventory();
    res.render('label', { items });
  } catch (error) {
    res.status(500).send('Error fetching inventory');
  }
});

module.exports = router;
