const express=require("express")
const app=express()
const {connection}=require("./config/db")
const cors=require("cors")
const userroute=require("./routes/user")
const dashboard=require("./routes/dashboard")


app.use(express.json())
app.use(cors())
app.use(userroute)
app.use(dashboard)







app.listen(4500,async()=>{
try {
    await connection
    console.log("connected to db");
} catch (error) {
    console.log(error);
}

    console.log("server is running on port 4500");
})