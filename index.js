//console.log("Backend Begins Today :6 March 2026");
require('dotenv').config() // or import dotenv from "dotenv"; dotenv.config()
const express = require('express') // or import express from "express"
const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/twitter', (req, res) => {
  res.send('Twitter Page')
})

app.get('/login',(req,res)=>{
  res.send('<h1>Please login at TeraByte world</h1>')
})

app.get('/youtube',(req,res)=>{
  res.send('Youtube Link : <a href="https://www.youtube.com/watch?v=pOV4EjUtl70&list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW&index=2&t=205s">TeraByte World</a>')
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
