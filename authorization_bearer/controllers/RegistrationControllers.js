const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const connection = require("../database/database_connection");

const register = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  try {
    connection.query(
      "SELECT * FROM users WHERE email = ? ",
      [email],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (results.length > 0) {
          return res.status(400).json({ message: "User already exists" });
        }

        const salt = bcrypt.genSalt(10);

        const hashedPassword = bcrypt.hash(password, salt);

        connection.query(
          "INSERT INTO USERS (email,firstName,lastName,password) VALUES (?,?,?,?)",
          [email, firstName, lastName, hashedPassword],
          (err, results) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            return res
              .status(201)
              .json({ message: "User registered successfully" });
          }
        );
      }
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {register};
