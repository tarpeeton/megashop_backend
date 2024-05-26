// ================== Kerakli kutubxonalarni import qiliamiz ==================
const mongoose = require("mongoose");
cotegories = ["O'yinchoqlar" , "ChinniBuyumlar" , "Aksessuarlar" , "Smartfon" , "Poyabzallar", "Uy Rozgor Buyumlari",
"AvtomobilQismlari" , "QurilishVaTa'mirlash" , "Go'zallik va Parvarish" , "Maishiy Texnika" , "Elektronika"
]
sizes = [21 , 22 , 23 , 24 ,25 , 26 , 27 , 28 , 29 , 30 , 31 , 32 , 33 , 34 , 35 , 36 , 37 , 40 , 41 , 42 , 43 , 44 , 45]
const productSchema = mongoose.Schema({
    productname: { type: String, required: true  , maxlength: 200},
    price: { type: String, required: true , default: 0},
    newPrice: { type: Number},
    reserve: { type: Number , default: 0},
    description: { type: String, required: true},
    cotegories: { type: String, required: true , enum: cotegories},
    sizes: {type: Number , enum: sizes},
    comments: [
      {
          userID: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
          rating: { type: Number , required: true},
          comment: { type: String  , required: true},
          phone: {type: String},
          name: { type: String}
      }
  ],
      soldOut: { type: Number , default: 0},
    image: [{ type: String , require:true }],
    createdAt: {
        type: Date,
        default: Date.now,
      },

})


  
  
  // ================= Modelni Controllerga Export qilamiz =================
  module.exports = mongoose.model("product", productSchema);