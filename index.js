const express = require('express')
const app = express()
const cors = require('cors');
const port = 5000
const mongoDB = require("./db")
const authRoutes = require("./routes/signup-in.js")
const productRoutes = require("./routes/Product.js")
const categoriesRoutes = require("./routes/Categories.js")
const cartRoutes = require("./routes/cart.js")
const {authenticatmiddle} =require("./middleware/authenticatmiddle.js")

 // Add this line

mongoDB();

// CORS configuration - choose ONE approach:

// APPROACH 1: Use cors package (recommended)
app.use(cors({
  origin: 'https://mern-amazom-clone.vercel.app', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// OR APPROACH 2: Manual headers (remove if using above)
// app.use((req,res,next)=>{
//     res.header("Access-Control-Allow-Origin","http://localhost:3000"); // Use explicit URL
//     res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
//     res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
//     next();
// })

app.use(express.json())

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/products', productRoutes); // Product routes
app.use('/api/categories', categoriesRoutes); // Product routes
app.use('/api/cart', cartRoutes); // Product routes

app.get('/', (req, res) => {
  res.send('Hello World! bobby')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
