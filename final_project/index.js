const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    const user = req.body.user;
    if (req.session.authorization) {
        const token = req.session.authorization['access_token'];
        console.log(token)
        jwt.verify(token, 'access', (err, user) => {
            if (!err) {
                req.user = user;
                next();
            }
            else {
                return res.status(403).json({message: "User not authenticated"})
            }
        })
    } else {
        return res.status(403).json({message: "User not authenticated"})
    }
});
 
const PORT =5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
