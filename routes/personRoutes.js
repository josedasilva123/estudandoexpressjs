const router = require('express').Router();

const Person = require('../models/Person');

router.post('/', async (req, res) => {
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

module.exports = router