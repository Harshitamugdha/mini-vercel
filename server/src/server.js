import dotenv from "dotenv";
const result = dotenv.config();

console.log(result);
console.log("SESSION_SECRET =", process.env.SESSION_SECRET);
import app from "./app.js";
import connectDB from "./config/db.js";


connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
