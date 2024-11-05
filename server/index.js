const express = require('express');
const app = express();
const cors=require('cors')
const db=require('./models/relations');
const dealersRoutes = require('./routes/dealers');
const fournisseursRoutes = require('./routes/fournisseurs');
const router = require('./routes/users');
const routerHist = require('./routes/history');
const roomRouter = require('./routes/rooms');
const userGameRouter = require('./routes/userGame');
// Defining a port
const PORT =5000;
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors())
app.use('/api',dealersRoutes)
app.use('/api',fournisseursRoutes)
app.use('/api',router)
app.use('/api',routerHist)
app.use('/api',roomRouter)
app.use('/api',userGameRouter)

app.listen(PORT)