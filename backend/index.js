import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const app = express();
app.use(express.json());
dotenv.config();

const port = process.env.PORT || 3000;

 const startServer = async () => {
   try {
     await mongoose.connect(process.env.MONGO_URL);
     app.listen(port, () => {
       console.log(`Server is listening on port ${port}...`);
     });
   } catch(error){
     console.log(error);
   }
 }

 startServer();
