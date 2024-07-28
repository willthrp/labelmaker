// index.js
const express = require('express');
const exphbs = require('express-handlebars');
const { getInventory } = require('./square');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Handlebars
const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.engine('hbs', exphbs({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');

// Define a route to fetch and display inventory
app.get('/label', async (req, res) => {
  try {
    const items = await getInventory();
    res.render('label', { items });
  } catch (error) {
    res.status(500).send('Error fetching inventory');
  }
});

const inventoryRoutes = require('./routes/inventory');

app.use(inventoryRoutes);

app.get('/', (req, res) => {
  res.render('label', { title: label})
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
