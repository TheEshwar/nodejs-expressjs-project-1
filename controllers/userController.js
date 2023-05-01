const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")


//@desc register user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async  (req, res) => {
    const {username, email, password} = req.body;

    if(!username || !email || !password)
    {
        res.status(400)
        throw new Error("All fields are mandatory!")
    }
    
    console.log('\n passed email :- ', email)
    const userAvailable = await User.find({email})

    if(userAvailable.length)
    {
        res.status(400)
        throw new Error("User email address already exists")
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10)
    console.log('\n Hashed password :- ', hashPassword)

    const user = await User.create({
        username,
        email,
        password: hashPassword
    })

    if(user){
        res.status(201).json({_id: user.id, email: user.email})
    }
    else
    {
        res.status(400)
        throw new Error("User data is not valid")
    }
    
    res.json({message: "Register the user"})
    
})

//@desc login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {

    const {email, password} = req.body

    if(!email || !password)
    {
        res.status(400)
        throw new Error("All fields are mandatory")
    }

    const user = await User.findOne({email})

    console.log('\n user :- ', user)
    if(user && (await bcrypt.compare(password, user.password)))
    {
        console.clear()
        console.log('\n b crypting ')
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            }
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn: "10m"
        })
        res.status(200).json({accessToken })
    }
    else{
        res.status(401)
        throw new Error("email or password is not valid")
    }
})

//@desc current user
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async  (req, res) => {
    res.json(req.user)
})

module.exports = {
    registerUser,
    loginUser,
    currentUser
}