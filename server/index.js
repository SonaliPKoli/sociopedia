import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import { register } from "./controllers/auth.js";
import postRoutes from "./routes/posts.js";
import { verifyToken } from "./middleware/auth.js";
import { createPost } from "./controllers/posts.js";
/* Configuration of Middleware that runs in between diff things*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* File storage configuration */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cp) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* Route with files */
app.post("/auth/register", upload.single("picture"), register);
//post route
app.post("/posts", verifyToken, upload.single("picture"), createPost);
/* Routes*/
app.use("/auth", authRoutes);
//routes for  express routes;
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
/*  Moongose setup*/
const PORT = 3001 || 6001;
mongoose
  .connect(
    "mongodb+srv://dummyuser:dummyuser123@cluster0.ms16h4x.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port : ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
