const express = require('express');
const mongoose = require('mongoose');

const app = express();

const Person = require('./models/Person');



app.use(
    express.urlencoded({
        extended: true,
    })
)

app.use(express.json());

app.post('/person', async (req, res) => {
    const {name, salary, approved} = req.body;
    const person = {
        name,
        salary,
        approved
    }

    if(!name || !salary || !approved){
        res.status(500).json({error: 'Campo faltante.'})
    }

    try {
        //Criando dados
        await Person.create(person);
        res.status(201).json({message: 'Pessoa inserida no sistema com sucesso!'})
    } catch (error) {
        res.status(500).json({error: error})  
    }
})

app.get('/', (req, res) => {
    res.json({message: 'Oi'});
})

mongoose.connect('')
.then(() => {
    console.log('Conectamos ao MongoDB!')
    app.listen(3000);
})
.catch((err) => console.log(err))

