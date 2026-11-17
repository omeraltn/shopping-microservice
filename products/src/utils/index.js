const bcrypt = require("bcrypt");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const { APP_SECRET } = require("../config");

//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

// NOTE: `this` bağlamı olmadığından bcrypt.hash doğrudan kullanılır.
// Microservice'e geçince bu utils her servise kopyalanacak.
module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt,
) => {
  return await bcrypt.compare(enteredPassword, savedPassword);
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    console.log(signature);
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

// customer servisine haber gönderecek fonksiyon
module.exports.PublishCustomerEvent = async (payload) => {
  try {
    await axios.post("http://localhost:3000/customer/app-events", { payload });
    console.log(" CustomerService haber gönderildi.");
  } catch (error) {
    console.log("CustomerService haber gönderilemedi: ", error.message);
    throw error;
  }
};

// Shopping servisine haber gönderecek fonksiyon
module.exports.PublishShoppingEvent = async (payload) => {
  try {
    // Microservice'e geçince bu fonksiyonun içi doldurulacak.
    await axios.post("http://localhost:3000/shopping/app-events", { payload });
    console.log(" ShoppingService haber gönderildi.");
  } catch (error) {
    console.log("ShoppingService haber gönderilemedi: ", error.message);
  }
};
