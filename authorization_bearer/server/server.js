const express = require("express");

const app = express();

const connection = require("../database/database_connection");

const cors = require("cors");

const PORT = process.env.PORT || 8000;


const bodyParser = require("body-parser");

const AuthenticateToken = require("../middlewares/AuthenticateToken")


app.use(express.json());

app.use(cors());

app.use(bodyParser.json());


app.use(bodyParser.urlencoded({extended:true}));



const initializeDatabase = () => {
  connection.query(
    "CREATE DATABASE IF NOT EXISTS authorizationBearer",
    (err, result) => {
      if (err) {
        console.log(`There was an error creating the database: `, err);

        process.exit(1);
      }

      connection.query("USE authorizationBearer", (err, result) => {
        if (err) {
          console.log(`There was an error selecting the database to use`);

          process.exit(1);
        }

        console.log(`Database successfully connected`);

        const createUsersTableQuery = `
                
                CREATE TABLE IF NOT EXISTS users(
                
                
                id INT AUTO_INCREMENT PRIMARY KEY,

                email VARCHAR(255) NOT NULL UNIQUE,

                firstName VARCHAR(255) NOT NULL,

                lastName VARCHAR(255) NOT NULL,

                password VARCHAR(255) NOT NULL,

                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP

                );
                
                `;

        connection.query(createUsersTableQuery, (err) => {
          if (err) {
            console.log("There was an error creating the users table: ", err);

            process.exit(1);
          }
          console.log("Users table created or already exists");
        });
      });
    }
  );
};

connection.connect((err) => {
  if (err) {
    console.log(`There was an error connecting to the database: `, err);

    process.exit(1);
  }
  initializeDatabase();
});

const registrationRoute = require("../routes/RegistrationRoute");


const AuthorizationRoute = require("../routes/AuthorizationRoute");

const UsersRoute = require("../routes/UsersRoute");




app.use("/api/register",registrationRoute);

app.use("/api/auth",AuthorizationRoute);


app.use(AuthenticateToken);


app.use("/api/users",UsersRoute);



app.listen(PORT, () => {
  console.log(`The server is running on PORT ${PORT}`);
});
