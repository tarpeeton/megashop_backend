const path = require("path");
const fs = require("fs").promises;

const newFolder = async () => {
  try {
    await fs.mkdir(path.join(__dirname, "../public"));
    await fs.mkdir(path.join(__dirname, "../public/product"));
    await fs.mkdir(path.join(__dirname, "../public/avatar"));
    console.log("Folders created successfully.");
  } catch (error) {
    console.error("Error creating folders:", error);
  }
};

module.exports = newFolder;
