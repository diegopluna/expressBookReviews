const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.query.username
  const password =req.query.password
  users.forEach((user) => {
    console.log(user)
    if (user.username === username) {
        res.status(300).send({message: "User with the same username already exists"})
    }
    if (!password) {
        res.status(300).send({message: "Password must be provided"})
    }
  })
  users.push({"username":username,"password":password});
  res.send("The user" + (' ')+ (username) + " Has been registered!")
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const getBooksPromise = new Promise((resolve, reject) => {
        resolve(books);
    });
    getBooksPromise.then((books) => {
        res.send(books);
    }).catch((error) => {
        res.status(500).send("Error fetching books: " + error);
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    const getBookPromise = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Book not found");
        }
    });
    getBookPromise.then((book) => {
        res.send(book);
    }).catch((error) => {
        res.status(404).send("Error fetching book: " + error);
    });
});

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    const filterBooksByAuthorPromise = new Promise((resolve, reject) => {
        try {
            const author = req.params.author;
            const filteredBooks = {};
            for (const key in books) {
                const book = books[key];
                if (book.author === author) {
                    filteredBooks[key] = book;
                }
            }
            resolve(filteredBooks);
        } catch (error) {
            reject(error);
        }
    });

    filterBooksByAuthorPromise.then((filteredBooks) => {
        res.send(filteredBooks);
    }).catch((error) => {
        res.status(500).send("Error filtering books by author: " + error);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const filterBooksByTitlePromise = new Promise((resolve, reject) => {
        try {
            const title = req.params.title;
            const filteredBooks = {};
            for (const key in books) {
                const book = books[key];
                if (book.title === title) {
                    filteredBooks[key] = book;
                }
            }
            resolve(filteredBooks);
        } catch (error) {
            reject(error);
        }
    });
    filterBooksByTitlePromise.then((filteredBooks) => {
        res.send(filteredBooks);
    }).catch((error) => {
        res.status(500).send("Error filtering books by title: " + error);
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  return res.send(books[isbn].reviews)
});

module.exports.general = public_users;
