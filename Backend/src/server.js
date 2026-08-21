const express = require('express');
const { connectDB } = require('./lib/db');

const dotenv = require('dotenv').config({path:"../.env"});

import cors from "cors"

import { clerkMiddleware } from "@clerk/express"

const app = express();
const PORT = process.env.PORT;

// Middilewares

app.use(express.json());

app.use(cors())

app.use(clerkMiddleware());

// Routes

app.get("/health",(req,res)=>{
    res.status(200).json({message:"yes its upp"})
})


app.listen(PORT,()=>{
    connectDB()
    console.log("server is running on Port",PORT);
})