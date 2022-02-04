const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const User = require("../models/User");


//Authenticate
async function Authenticate(req, res, next){
    const token = req.headers['auth'];
    jwt.verify(token, process.env.JWT_SECRETKEY, (err, decoded) => {
        if(err){
            res.status(500).json({message: 'Token inválido'});
            return;
        } 
        req.user = {
            name: decoded.name,
            email: decoded.email,
        }
        next();
    })
}

//Create User
router.post("/", async (req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        res.status(500).json({message: 'Desculpe, algum parâmetro está faltando.'});
        return;
    }

    const existingUser = await User.findOne({email: email});
    if(existingUser){
        res.status(500).json({message: 'Desculpe, o e-mail fornecido já pertence a um usuário.'});
        return;
    }

    const encryptedPassword = bcrypt.hashSync(password, 2);

    try {
        const user = {
            name,
            email,
            password: encryptedPassword,
        }
        await User.create(user);
        res.status(200).json({message: 'Usuário cadastrado com sucesso!'})
    } catch (error) {
        res.status(500).json(error);
    }
   
})

// Login
router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        res.status(500).json({message: 'Desculpe, algum parâmetro está faltando.'});
        return; 
    }
    try {
        const user = await User.findOne({ email: email});
        if(!user){
            res.status(500).json({message: 'Desculpe, usuário não existe.'});
            return;
        }
        if(!bcrypt.compareSync(password, user.password)){
            res.status(500).json({message: 'Desculpe, senha incorreta.'});
            return;        
        }
        const token = jwt.sign({
            name: user.name,
            email: user.email,
        }, process.env.JWT_SECRETKEY, {expiresIn: '12h'});
    
        res.status(200).json({token: token});    
    } catch (error) {
        res.status(500).json(error);    
    }
   
})

//Update User
router.patch("/", Authenticate, async (req, res) => {
    const {email} = req.user;    
    const {name} = req.body;
    if(!email){
        res.status(500).json({message: 'Desculpe, algum parâmetro está faltando.'});
        return; 
    }
    const findUser = await User.findOne({ email: email });

    const user = {
        name,
    }
    if(!findUser){
        res.status(500).json({message: 'Desculpe, usuário não existe.'});
        return;   
    }
    try {
        await User.updateOne({ email: email}, user);
        res.status(500).json({message: 'Usuário atualizado com sucesso!'});
    } catch (error) {
        res.status(500).json(error);      
    }    
})

//Change Password
router.patch("/password", Authenticate, async (req, res) => {
    const {email} = req.user;  
    const {password, newpassword} =  req.body; 

    const findUser = await User.findOne({ email: email });
    if(findUser.password != password){
        res.status(500).json({message: 'Usuário atualizado com sucesso!'});    
    }
})

module.exports = router;