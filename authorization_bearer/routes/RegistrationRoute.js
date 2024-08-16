const router = require("express").Router()

const RegistrationController = require("../controllers/RegistrationControllers");




router.post('/post',RegistrationController.register);



module.exports = router;