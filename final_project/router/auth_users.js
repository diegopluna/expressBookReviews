const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    for (const user of users) {
        if (user.username === username) {
            if (user.password === password) {
                return true
            }
            return false
        }
    }
    return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.query.username;
    const password = req.query.password;
    if (!isValid(username)) {
        return res.status(404).json({message: "Invalid username"});
    }
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: username
          }, 'access', { expiresIn: 60 * 60 });
    
          req.session.authorization = {
            accessToken
        }
        return res.status(200).send("User successfully logged in");
    }
    return res.status(404).json({message: "Invalid password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const accessToken = req.session.authorization.accessToken;
    const decodedToken = jwt.verify(accessToken, 'access');
    const username = decodedToken.data;
    const isbn = req.params.isbn;
    const review = req.query.review


    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }
    if (books[isbn]) {
        if (!books[isbn].reviews) {
            books[isbn].reviews = {};
        }
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review added successfully" });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const accessToken = req.session.authorization.accessToken;
    const decodedToken = jwt.verify(accessToken, 'access');
    const username = decodedToken.data;
    const isbn = req.params.isbn;
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for this user and book" });
    }
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
