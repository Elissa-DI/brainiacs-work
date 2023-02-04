
let userEl = document.getElementById("user")
let passEl = document.getElementById("password")
let loginEl = document.getElementById("login")

let usernames = []
let passwords = []

let allDone = [
    {
        user: "usernames",
        password: "passwords" 
    }
]

usernames.push(getElementById("user"))
passwords.push(getElementById("password"))

const fs = require('fs')
const http = require('http')

const server = http.createServer((req, res) => {
    setTimeout(() => {
     if( url === "/") {
        fs.readFile("login.html", "utf-8", (err, data) => {
            if(err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(err);
            } else {
                res.end(data);
            }
        })
     } else if ( req.url === "/style.css") {
        fs.readFile("login.css", "utf-8", (err, data) => {
            if(err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(err)
            } else {
                res.end(data)
            }
        })
     } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found')
     }

     if(req.method === "POST" ) {
        let body = ""
        req.on("data", (chunk) => {
            body += chunk.toString();
            console.log("body");
        })
     }
     req.on("end", () => {
        if(allDone) {
            res.end('Successfully done!')
        } else {
            res.end('Invalid credential')
        }
     })















    }, 8010);
})

