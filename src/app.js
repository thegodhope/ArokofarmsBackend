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
