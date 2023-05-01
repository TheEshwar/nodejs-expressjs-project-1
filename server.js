const express = require("express")
const errorHandler = require("./middleware/errorHandler")
const connectionDb = require("./config/dbConnection")
const dotenv = require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

connectionDb()
app.use(express.json())
app.use("/api/contacts", require("./routes/contactRoutes"))
app.use("/api/users", require("./routes/userRoutes"))
app.use(errorHandler)

app.listen(port, () => {
    console.log(`\n server is running on PORT ${port}`)
})