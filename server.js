import app from "./src/app.js";
import crypto from "crypto";
// import connectMongodb from "./src/helpers/connections-mongodb.js";

// Kết nối 1 DB thì dùng cách này, nếu kết nối nhiều DB thì nó chạy thẳng trong /helpers/connections-multi-môngdb.js
// connectMongodb;

// Random 2 cái key sử dụng cho token và refresh token
const key1 = crypto.randomBytes(32).toString("hex");
const key2 = crypto.randomBytes(32).toString("hex");

// console.table({ key1, key2 });

const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
