const fs = require('fs');
const http = require('http');
let form = document.getElementById("form-el");
let errorEl = document.getElementById("error-el");

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });

form.addEventListener("submit", (event) => {
    event.preventDefault();


let username = document.getElementById("user").value;
let password = document.getElementById("password").value;


fetch("user.json")
.then(response => {
    if(!response.ok) {
        throw new Error("Either one of credentials incorrect")
    }
    return response.json();
})


.then(user => {
    let usery = user.find(user => user.username === username && user.password === password);
if(usery) {
    window.location.href = "done.html"
} else {
    errorEl.style.display = "block";
    errorEl.innerHTML = "<h1>Invalid username or password</h1>"
 }
})


.catch(error => {
    console.log("Fetching process operation faced a problem", error);
     });
   });
}).listen(8000,()=>{
    console.log(`server running ...`);
  });
