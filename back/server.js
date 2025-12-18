require("dotenv").config();
const app = require("./src/app");
const { dbConnect } = require("./src/db/");
const initSocket = require("./src/socket/socket.config");

const PORT = process.env.PORT ?? 3500;

dbConnect().then(() => {
  initSocket(app);
  app.listen(PORT, () => console.log(`Server listening on PORT  ${PORT} ...`));
});
