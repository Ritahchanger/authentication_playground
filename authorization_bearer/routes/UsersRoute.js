const UserControllers = require("../controllers/UsersController");

const router = require("express").Router();



router.get("/get",UserControllers.getUsers);




module.exports = router