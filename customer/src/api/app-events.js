const CustomerService = require("../services/customer-service.js");

module.exports = (app) => {
  app.use("/app-events", async (req, res) => {
    // sutomer servicedeki fonksiyonları kullanabilmek için örnek al
    const service = new CustomerService();

    // isteğin body içerisinde gelen payload verisine eriş
    const { payload } = req.body;

    // diğer servisden gelen habere göre gerekli fonksiyonları çalıştır
    await service.SubscribeEvents(payload);

    console.log("--- customer servis haberi işledi-----");

    // haberi gönderen servise haberi aldığımı söyle
    res.status(200).json({ message: "Webhook mesajı alındı" });
  });
};
