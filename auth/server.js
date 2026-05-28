import app from "./src/app.js";
import { connectDB } from "./config/db.js";

app.listen(3000, async () => {
    await connectDB();
    console.log("Server is running on port 3000");
})