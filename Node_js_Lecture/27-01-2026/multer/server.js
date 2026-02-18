import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';

const app = express();

const PORT = 6030;

app.listen(PORT , (err) => {
  console.log('server start on port 6030');
})