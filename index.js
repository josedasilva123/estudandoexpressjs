require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const personRoutes = require('./routes/personRoutes')

const app = express();

app.use(
    express.urlencoded({
        extended: true,
    })
)

app.use(express.json());

app.use('/person', personRoutes);

app.get('/', (req, res) => {
    res.json({message: 'Oi'});
})

mongoose.connect(process.env.DATABASE_URL)
.then(() => {
    console.log('Conectamos ao MongoDB!')
    app.listen(3000);
})
.catch((err) => console.log(err))

