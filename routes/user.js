const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { UserModel } = require("../models/user.model")
const auth=require("../middleware/authentication")
const {blacklist}=require("../models/blacklist")



const Router = express.Router()

Router.post("/signup", async (req, res) => {

    try {

        const {email, password,confirmpassword } = req.body;

        if (password !== confirmpassword) {
            return res.status(400).json({ msg: 'Password  do not match' });
        }


      
        const Userexit = await UserModel.findOne({ email })

        if (Userexit) {
            return res.status(201).json({ msg: "User already exist" })
        }

        let  hashedPassword = await bcrypt.hash(confirmpassword, 10);

        bcrypt.hash(password, 8, async (err, hash) => {

            if (err) {
                res.send({ "msg": "Something went Wrong", "err": err.message })
            } else {

                const user = new UserModel({ email, password: hash, confirmpassword:hashedPassword })
                await user.save()
                res.send(user)
            }
        })
    } catch (err) {
        console.error( err);
        res.status(500).json(err);
    }
})

Router.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body

        const user = await UserModel.findOne({ email })
       

        if (!user) {
            return res.status(401).json({ message: "user not found please signup" })
        }

        const isPassword= await bcrypt.compare(password, user.password)

        if (!isPassword) {
            return res.status(201).json({ message: "Invalid password" })
        }

        const token = jwt.sign({ userId: user._id }, "masai");


        res.status(200).json({ msg: "Login Successful", token: token });

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
})
Router.get("/logout",auth,(req,res)=>{
    blacklist.push(req.headers?.authorization?.split(" ")[1])
    res.send("logout successful")
    })


module.exports =Router