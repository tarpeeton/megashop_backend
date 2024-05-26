const router = require("express").Router();
const productController = require("../controller/product");
const { uploadMultiple } = require("../middleware/file.upload");
const cachingMiddleware = require("../middleware/cashe");

router.post("/create", uploadMultiple(), productController.createProduct);
router.get("/getAll", cachingMiddleware, productController.getAllProduct);
router.get("/categories", productController.getAllProductWithCategories);
router.get("/:productID", cachingMiddleware, productController.getProductWithID);
// In your routes file (e.g., productRoutes.js or similar)
router.get("/search/product", productController.searchProduct);


module.exports = router;
