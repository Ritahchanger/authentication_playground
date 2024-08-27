const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

require("dotenv").config();

const connection = require('../database/database_connection');

const login = async (req,res) =>{

    const { email ,password } = req.body;

    try{

        connection.query("SELECT * FROM users WHERE email=?",[email],async(err,results)=>{

            if(err){

                return res.status(500).json({error:err.message});
            }

            if(!Array.isArray(results) || results.length ===0 ){
                return res.status(401).json({message:"Invalid email or password"});

            }

            const user = results[0];

            const isMatch = await bcrypt.compare(password,user.password);

            if(!isMatch){

                return res.status(401).json({message:"Invalid email or password"});

            }

            const token = jwt.sign({
                id:user.id,email:user.email,firstName:user.firstName,lastName:user.lastName
            },process.env.JWT_SECRET,{
                expiresIn:'1h'
            })

            return res.json({token});

        })

        

    }
    catch(error){

        res.status(500).json({message:error.message});

    }

}

module.exports = { login}