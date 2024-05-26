const productSchema = require('../model/product');

// Create Product
exports.createProduct = async (req, res, next) => {
    try {
        const { productname, price, description, cotegories } = req.body;
        const productImages = req.files;
        const images = Array.isArray(productImages) ? productImages : [productImages];
        const imageNames = images.map(image => image.filename);
        const newProduct = new productSchema({
            productname,
            price,
            description,
            cotegories,
            image: imageNames
        });
        const result = await newProduct.save();
        res.status(201).json({ success: true, result });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: 'Server xatosi' });
    }
};

// Get All Products
exports.getAllProduct = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    try {
        const count = await productSchema.countDocuments();
        const skip = (page - 1) * limit;
        const products = await productSchema.find().skip(skip).limit(limit).lean();
        res.status(200).json({ success: true, products, count });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: 'Server xatosi' });
    }
};

// Get All Products by Categories
exports.getAllProductWithCategories = async (req, res, next) => {
    try {
        const { categories } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        let categoryFilter = {};

        if (categories) {
            const categoriesArray = categories.split(',');
            categoryFilter = { cotegories: { $in: categoriesArray } };
        }


        const skip = (page - 1) * limit;
        const products = await productSchema.find(categoryFilter).skip(skip).limit(limit).lean();

        const count = await productSchema.countDocuments(categoryFilter);

        if (!products || products.length === 0) {
            return res.status(404).json({ success: false, error: 'Ma\'lumotlar topilmadi' });
        }

        res.status(200).json({ success: true, products, count });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ success: false, error: 'Server xatosi' });
    }
};



// Get Product by ID
exports.getProductWithID = async (req, res, next) => {
    try {
        const { productID } = req.params;
        const product = await productSchema.findById(productID).lean();

        if (!product) {
            return res.status(404).json({ success: false, error: 'Maxsulot topilmadi' });
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: 'Server xatosi' });
    }
};

// Search Product by Name
exports.searchProduct = async (req, res, next) => {
    try {
        const { productName } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const currentPage = parseInt(page) || 1;

        if (!productName || typeof productName !== 'string') {
            return res.status(400).json({ error: 'productName parametri to\'g\'ri kiritilmagan yoki tipi noto\'g\'ri' });
        }

        const sanitizedProductName = productName.toLowerCase().trim();
        const skip = (currentPage - 1) * limit;

        const products = await productSchema.find({
            productname: { $regex: new RegExp(sanitizedProductName, 'i') }
        }).skip(skip).limit(limit).lean();

        const count = await productSchema.countDocuments({
            productname: { $regex: new RegExp(sanitizedProductName, 'i') }
        });

        if (products.length === 0) {
            return res.status(404).json({ error: 'Maxsulot topilmadi' });
        }

        res.status(200).json({ success: true, message: 'Maxsulot topildi', products, count });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: 'Server xatosi' });
    }
};

