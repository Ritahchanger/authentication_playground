const bcrypt = require('bcryptjs');
const connection = require('../database/database_connection'); // Adjust path as needed

const register = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  try {

    connection.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!Array.isArray(results)) {
        return res.status(500).json({ error: "Unexpected query result format" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      try {
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        connection.query(
          "INSERT INTO users (email, firstName, lastName, password) VALUES (?, ?, ?, ?)",
          [email, firstName, lastName, hashedPassword],
          (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            return res.status(201).json({ message: "User registered successfully" });
          }
        );
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {register};
