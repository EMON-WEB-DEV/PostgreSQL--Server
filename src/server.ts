import express, { Request, Response } from "express"
import {Pool} from "pg"
import dotenv from "dotenv"
import path from "path";

dotenv.config({path:path.join(process.cwd() , '.env')});

const app = express()
const port = 5050



const pool = new Pool({
  connectionString: `${process.env.CON_STR}`
});

const testDBConnection = async () => {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        age INT NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log("Connected to the database and ensured 'users' table exists.");
};

testDBConnection();







// Middleware to parse JSON bodies
app.use(express.json());


app.get('/', (req :Request,res : Response)=> {
  res.send('Hello Web Server!')
})

app.post ('/', (req :Request,res : Response)=> {
  console.log(req.body);
  res.status(201).json({
    success: true,
    message: "Data received successfully"
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
