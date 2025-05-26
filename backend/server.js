import "dotenv/config";
import express from "express";
import cors from "cors";
import AuthRoutes from "./routes/auth.routes.js";

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/auth/", AuthRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
