const express = require("express");

const fs = require("fs");

const authenticate = require("./aut/auth");

const app = express();
const port = 3000;

const controller = require("./controller/user");

app.use(express.json());

app.post("/login", controller.userController);
app.get("/homes", authenticate.auth, controller.homeController);
app.post("/addBook", authenticate.auth, controller.bookController);
app.delete("/deleteBook", authenticate.auth, controller.deleteBookController);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
