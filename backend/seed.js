import mongoose from "mongoose";
import { readFile } from "fs/promises";
import Job from "./models/Job";
import populateData from "./populateData";

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const json = JSON.parse(
      await readFile(new URL(populateData, import.meta.url))
    );
    await Job.create(json);
    console.log("Jobs created!");
    process.exit(0);
  }catch(error){
    console.log(error);
    process.exit(1)
  }
}

seed();
