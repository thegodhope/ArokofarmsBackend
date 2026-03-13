require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const connectToDatabase = require("./database/connection");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const port = process.env.PORT || 3000;
connectToDatabase();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Aroko API',
      version: '1.0.0',
      description: 'API Documentation for the Aroko Subscription API',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Files containing annotations
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/uploads', express.static('uploads')); // Make uploads folder public
app.use('/api/subscriptions', subscriptionRoutes);
app.get('/api/test', (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Aroko API is live and connected!",
    timestamp: new Date().toISOString()
  });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
