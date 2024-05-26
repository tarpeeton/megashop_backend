const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = require("../model/user");
const Product = require("../model/product");
const dotenv = require('dotenv');
dotenv.config();

const generateAccessToken = (user) => {
    return JWT.sign({ _id: user._id }, process.env.SECRET_KEY, {
        expiresIn: process.env.SECRET_TIME,
    });
};

exports.REGISTER = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const checkUser = await userSchema.findOne({ email });
        if (checkUser) {
            return res.status(400).json({ success: false, message: "Ushbu email manzili mavjud" });
        } else {
            const user = new userSchema({ username, email, password });
            const token = generateAccessToken(user);

            req.session.role = user.role;
            req.session._id = user._id;

            await req.session.save();
            await user.save();
            return res.status(201).json({ success: true, user, token, message: "Ro'yhatdan o'tdingiz" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.LOGIN = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userSchema.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Email yoki parol xato" });
        } else {
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Email yoki parol xato" });
            } else {
                const token = generateAccessToken(user);

                req.session.role = user.role;
                req.session._id = user._id;

                await req.session.save();
                return res.status(200).json({ success: true, user, token, message: "Xush kelibsiz" });
            }
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.ME = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Avtorizatsiyadan o'tilmagan" });
        }

        const tokenString = token.split(' ')[1];
        let decodedToken;
        try {
            decodedToken = JWT.verify(tokenString, process.env.SECRET_KEY);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, message: "Token muddati tugagan" });
            } else {
                return res.status(401).json({ success: false, message: "Token xato" });
            }
        }

        if (!decodedToken || !decodedToken._id) {
            return res.status(401).json({ success: false, message: "Token xato" });
        }

        const userID = decodedToken._id;
        const user = await userSchema.findById(userID);

        if (!user || !user._id) {
            return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi" });
        }

        return res.status(200).json({ success: true, user, token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server xatosi" });
    }
};


exports.commentProduct = async (req, res) => {
    try {
        const { userID } = req.params;
        const { productID, rating, comment, phone, name } = req.body;
        console.log(userID , productID, rating, comment, phone, name)
        const product = await Product.findById(productID);
        if (!product) {
            return res.status(404).json({ success: false, message: "Maxsulot topilmadi" });
        }

        product.comments.push({ userID, rating, comment, phone, name });
        const totalRatings = product.comments.reduce((total, comment) => total + comment.rating, 0);
        product.rating = totalRatings / product.comments.length;
        await product.save();
        res.status(201).json({ success: true, product });
    } catch (error) {
        console.error("Sharh yozishda xatolik yuz berdi:", error);
        res.status(500).json({ success: false, message: "Server xatosi" });
    }
};