const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js").books;
let updateBooks = require("./booksdb.js").updateBooks;
const regd_users = express.Router();

let users = [];

function addUser(user) {
    users.push(user);
}

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
   const user = users.filter((user) => user.username == username)
   if (user.length == 0) return false;
   return true; 
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    if (!isValid(username)) return false;
    const user = users.filter((user) => user.username == username);
    if (password == user[0].password) return true;
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const user = req.body.username;
  const pswd = req.body.password;
  
  console.log("Users: ", users);

  if (!user) {
    return res.status(300).json({message: "Body empty"});
  }

  if (!authenticatedUser(user, pswd)) {
    return res.status(300).json({message: "Incorrect username or password"});
  }

    const obj = {"username": user, "password": pswd};
    let access_token = jwt.sign({
        data: obj
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
        access_token
    };

    console.log(access_token)

    return res.status(200).send("Customer successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;
  
  books[isbn]['reviews'][username] = review;
  
  updateBooks(books);
  return res.status(200).json({message: "The review for the book with ISBN " + isbn + " has been added/updated"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const username = req.user.username;
    
    delete books[isbn]['reviews'][username];
    
    updateBooks(books);
    return res.status(200).json({message: "Review for the book with ISBN " + isbn + " has been deleted"});
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.addUser = addUser;
