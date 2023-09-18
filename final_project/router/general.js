const express = require('express');
let books = require("./booksdb.js").books;
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const addUser = require('./auth_users.js').addUser;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if (isValid(username)) {
    return res.status(300).json({message: "User already exists"});
  }

  addUser({"username": username, "password": password});
  console.log(users);
  return res.status(200).json({message: "Customer successfully registered. Now you can login."});
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]['reviews']);
});


// Get the book list available in the shop
function getAllBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);        
    });
}

public_users.get('/',function (req, res) {
    //Write your code here
    return getAllBooks()
                .then((bks) => res.send(JSON.stringify(bks, null, 4)),
                      (error) => res.send("unable to fetch books"))
    // return res.status(300).json({message: "Yet to be implemented"});
});
  
// Get book details based on ISBN
function getBooksByISBN(isbn) {
    const book_ = books[isbn];
    return new Promise((resolve, reject) => {
        if (book_) {
            resolve(book_);   
        } else {
            reject("Book not found");
        }     
    });
}

public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return getBooksByISBN(isbn).then(
        (bk) => res.status(200).json(bk),
        (error) => res.status(300).json(error)
    );
});

// Get book details based on author
function getBooksByAuthor(author) {
    const book_ = Object.values(books).filter((book) => book.author == author);
    return new Promise((resolve, reject) => {
        if (book_.length != 0) {
            resolve({"booksbyauthor": book_});   
        } else {
            reject("Books not found");
        }     
    });
}

public_users.get('/author/:author',function (req, res) {
//Write your code here
    const author = req.params.author;
    return getBooksByAuthor(author).then(
        (bks) => res.status(200).json(bks),
        (error) => res.status(300).json(error)
    );
});

// Get all books based on title
function getBooksByTitle(title) {
    const book_ = Object.values(books).filter((book) => book.title == title);
    return new Promise((resolve, reject) => {
        if (book_.length != 0) {
            resolve({"booksbytitle": book_});   
        } else {
            reject("Book not found");
        }     
    });
}

public_users.get('/title/:title',function (req, res) {
//Write your code here
    const title = req.params.title;
    return getBooksByTitle(title).then(
        (bk) => res.status(200).json(bk),
        (error) => res.status(300).json(error)
    );
});


module.exports.general = public_users;
