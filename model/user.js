// ================== Kerakli kutubxonalarni import qiliamiz ==================
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    username: { type: String, required: true  , maxlength: 18},
    email: { type: String, required: true },
    password: { type: String, required: true  ,  minlength:8},
    image: { type: String},
    role: { type: String, enum: ["admin", "user"], default: "user" },
    createdAt: {
        type: Date,
        default: Date.now,
      },

})

// ================= Agar Parol qoyilsa yoki Tahrirlansa Parolni hashlab ketish uchn =====================
userSchema.pre("save", async function (next) {
    if (!this.isModified("password") && !this.isNew) {
      return next();
    }
  
    try {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
  });
  
  
  // ================= Modelni Controllerga Export qilamiz =================
  module.exports = mongoose.model("user", userSchema);