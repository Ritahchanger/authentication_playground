const connection = require('../database/database_connection');


const getUsers = (req,res)=>{

    connection.query("SELECT * FROM users",(err,results)=>{

        if(err){


            return res.status(500).json({error:err.message});

        }

        res.status(200).json(results);

    })

}

module.exports ={ getUsers }