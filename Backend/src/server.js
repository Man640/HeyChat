const express = require('express');
const { connectDB } = require('./lib/db');

const dotenv = require('dotenv').config({path:"../.env"});

import cors from "cors"

import { clerkMiddleware } from "@clerk/express"

const app = express();
const PORT = process.env.PORT;
const FRONTEND_URI = process.env.FRONTEND_URI;

// Middilewares

app.use(express.json());

app.use(cors({origin:FRONTEND_URI,credentials:true}))

app.use(clerkMiddleware());

// Routes

app.get("/health",(req,res)=>{
    res.status(200).json({message:"yes its upp"})
})


app.listen(PORT,()=>{
    connectDB()
    console.log("server is running on Port",PORT);
})