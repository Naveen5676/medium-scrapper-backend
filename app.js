const express= require('express')
const bodyParser= require('body-parser')
const cors = require('cors')

const scrapeRoute = require('./Routers/ScrapeMedium')

const app = express()
const PORT = process.env.PORT || 4000;

// Use CORS middleware to allow cross-origin requests
app.use(cors())
app.use(bodyParser.json());

app.use(scrapeRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port  ${PORT}`);
  });