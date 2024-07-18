const express= require('express')
const bodyParser= require('body-parser')
const cors = require('cors')

const scrapeRoute = require('./Routers/ScrapeMedium')

const app = express()

app.use(cors())
app.use(bodyParser.json());

app.use(scrapeRoute)

app.listen(4000, () => {
    console.log('Server is running on port 4000');
  });