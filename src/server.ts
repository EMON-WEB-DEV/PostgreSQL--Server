import express, { Request, Response } from "express"
import {Pool} from "pg"
import dotenv from "dotenv"
import path from "path";
import { get } from "http";

dotenv.config({path:path.join(process.cwd() , '.env')});

const app = express()
const port = 5050



const pool = new Pool({
  connectionString: `${process.env.CON_STR}`
});

// Function to test database connection and create 'users' table if it doesn't exist
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

// Endpoint to add a new user

app.post ('/users', async(req :Request,res : Response)=> {

const {name, age, email, address} = req.body;
  try {
const result = await pool.query(
  'INSERT INTO users (name, age, email, address) VALUES ($1, $2, $3, $4) RETURNING *',
  [name, age, email, address],
);
res.status(201).json(
  {success: true,
  message: "User added successfully",
  data: result.rows[0]

}

);
console.log(result.rows);
  }
  
 catch (error:any) {
  res.status(500).json
  ({
    success: false,
    message: 'Error inserting user'
   });
  console.error('Error inserting user:', error.message);
 }

});

// Endpoint to get all users
app.get('/users', async (req: Request, res: Response) => {
  try {
    const getUsers = await pool.query('SELECT * FROM users');
    res.status(200).json({
      success: true,
      data: getUsers.rows
     
    });
    console.log(getUsers.rows);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
    console.error('Error fetching users:', error.message);
  }
});


// Endpoint to get a user by ID

app.get('/users/:id', async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const getUser = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (getUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      data: getUser.rows[0]
    });
    console.log(getUser.rows[0]);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user'
    });
    console.error('Error fetching user:', error.message);
  }
});

// Start the server

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
