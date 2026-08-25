const express = require('express');
const { connectDB } = require('./lib/db');

const dotenv = require('dotenv').config({ path: ".env" });

const cors = require("cors");


const fs = require('fs');

const path = require('path');

const { clerkMiddleware } = require("@clerk/express");

const app = express();
const PORT = process.env.PORT;
const FRONTEND_URI = process.env.FRONTEND_URI;

const publicDir = path.join(process.cwd(),"public");

// Middilewares

app.use(express.json());

app.use(cors({origin:FRONTEND_URI,credentials:true}))

app.use(clerkMiddleware());

// Routes

app.get("/health",(req,res)=>{
    res.status(200).json({message:"yes its upp"})
})
// of the public directory exists, serve static files
// this is for the production build 

if(fs.existsSync(publicDir)){
    app.use(express.static(publicDir));

    app.get("/{*}",(req,res)=>{
        res.sendFile(path.join(publicDir,"index.html"),(err)=>next(err));
    });
}


app.listen(PORT,()=>{
    connectDB()
    console.log("server is running on Port",PORT);
})