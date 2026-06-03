import "dotenv/config";
import app from "./src/app.js";

app.listen(4000, async () => {
    console.log("Server is running on port 4000");
})
