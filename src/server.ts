import express, { Request, Response } from "express"
const app = express()
const port = 5050

// Middleware to parse JSON bodies
app.use(express.json());


app.get('/', (req :Request,res : Response)=> {
  res.send('Hello Web Server!')
})

app.post ('/', (req :Request,res : Response)=> {
  console.log(req);
  res.status(201).json({
    success: true,
    message: "Data received successfully"
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
