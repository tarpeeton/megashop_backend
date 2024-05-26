const router = require("express").Router();
const userController = require("../controller/user");

router.post("/register", userController.REGISTER);
router.post("/login", userController.LOGIN);
router.post('/comment/:userID', userController.commentProduct);

router.get("/authorization", userController.ME);

module.exports = router;
