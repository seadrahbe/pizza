// Imports
import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
import {validateForm} from './validation.js';

// Define a port number where server will listen
const PORT = 3000;

// Load environment variables frpm .env
dotenv.config();

// Create an express application
const app = express();

// Enable static file serving
app.use(express.static('public'));

// "Middleware" allows express to read form data and store it in req.body
app.use(express.urlencoded({ extended: true }));

// Set view engine to ejs
app.set('view engine', 'ejs');

// Create a pool (bucket) of database connections
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

// Database test route
app.get('/db-test', async(req, res) => {

    try {
        const pizza_orders = await pool.query('SELECT * FROM orders');
        res.send(pizza_orders[0]);
    } catch(err) {
        console.error('Database error: ', err);
    }
    
});

// Define our main route ('/')
// Default route
app.get('/', (req, res) => {
    res.render('home');
});

// Contact route -- does not have to match folder name, just a mapping
app.get('/contact-us', (req, res) => {
    res.render('contact');
});

// Thank you route
app.get('/thank-you', (req, res) => {
    res.render('confirmation', orders);
});

// Submit order route
// {"fname":"a","lname":"a","email":"a","method":"pickup","size":"medium","comment":"","discount":"on"}
app.post('/submit-order', async(req, res) => {

    const order = req.body;

    const valid = validateForm(order);

    if (!valid.isValid) {
        console.log(valid);
        res.render('home', {errors: valid.errors});
        return;
    }

    // Create an array of order data
    const params = [
        order.fname,
        order.lname,
        order.email,
        order.size,
        order.method,
        Array.isArray(order.toppings) ? order.toppings.join(", ") : " none",
    ];

    // Insert new order into database
    const sql =  `INSERT INTO orders (fname, lname, email, 
                    size, method, toppings)
                    VALUES (?, ?, ?, ?, ?, ?)`;

    const result = await pool.execute(sql, params)

    // Send user to thank you page
    res.render('confirmation', { order } );
});

// Admin route
app.get('/admin', async(req, res) => {

    // Read all orders from db
    // newest first
    let sql = 'SELECT * FROM orders ORDER BY timestamp DESC';
    const orders = await pool.query(sql);

    res.render('admin', { orders: orders[0] });
});

// Start server and listen on designated port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});