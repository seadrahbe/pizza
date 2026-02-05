// Import the express module
import express from 'express';

// Create an express application
const app = express();

// Define a port number where server will listen
const PORT = 3000;

// Enable static file serving
app.use(express.static('public'));

// "Middleware" allows express to read form data and store it in req.body
app.use(express.urlencoded({ extended: true }));

// Create a temp array to store orders -- const makes pointer / reference stay, list can grow/shrink
const orders = [];

// Define our main route (root?) ('/')
// Default route
app.get('/', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/home.html`);
});

// Contact route -- does not have to match folder name, just a mapping
app.get('/contact-us', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/contact.html`);
});

// Thank you route
app.get('/thank-you', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/confirmation.html`);
});

// Submit order route
// {"fname":"a","lname":"a","email":"a","method":"pickup","size":"medium","comment":"","discount":"on"}
app.post('/submit-order', (req, res) => {

  // Create a JSON object to store the order data
  const order = {
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    method: req.body.method,
    toppings: req.body.toppings ? req.body.toppings : " none",
    size: req.body.size,
    comment: req.body.comment,
    timestamp: new Date()
  };

  // Add order object to orders array
  orders.push(order);

  // Send user to thank you page
  res.sendFile(`${import.meta.dirname}/views/confirmation.html`);
});

// Admin route
app.get('/admin', (req, res) => {
    res.send(orders);
});

// Start server and listen on designated port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});