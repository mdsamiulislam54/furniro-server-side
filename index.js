import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import ProductModel from "./Schema/Products.js";
import { verifyToken } from "./Middleware/verifyToken.js";
dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.post("/jwt", async (req, res) => {
  const user = {
    email: req.body.email,
  };

  // Generate JWT token
  const token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: "2h" });

  // Send token in cookies
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax', // Optional, for cookie security
  });

  // Send response to client
  res.status(200).send({ message: "Token generated and sent", token: token });
});


app.get("/products", async (req, res) => {
  const result = await ProductModel.find()
    .sort({ reviews: -1, rating: -1 })
    .limit(12);
  res.json(result);
});

app.get("/all-products", async (req, res) => {
  const result = await ProductModel.find({ isNewArrival: true }).lean();
  res.json(result);
});

app.get("/shop/products", verifyToken, async (req, res) => {
  const { category, minPrice, maxPrice, rating, email } = req.query;
  
console.log(email)
console.log(req.decode.email)
 if(email !== req.decode.email){
    return res.status(403).send({message:"Forbidden access"})
 }
  const query = {};

  if (category) {
    query.category = category;
  }

  if (minPrice || maxPrice) {
    query.price = {};

    if (minPrice) {
      query.price.$gte = parseFloat(minPrice);
    }
    if (maxPrice) {
      query.price.$lte = parseFloat(maxPrice);
    }
  }

  if (rating) {
    query.rating = { $gte: parseInt(rating) };
  }

  try {
    const result = await ProductModel.find(query).lean();
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Something went wrong", err });
  }
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
