const http = require("http");
const fs = require("fs");
 http.createServer((req, res) => {
    setTimeout(() => {
  fs.readFile("login.html", "utf-8", (err, data) => {
    if (err) console.log(err);
    fs.readFile("login.css", "utf-8", (err, css) => {
      if (err) {
        console.log(err);
      }else {
        data = data.replace("</head>", `<style>${css}</style></head>`);
        res.end(data);
      }
    });
    res.write(data);
  });
    if (req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
          console.log(body);
        });
        req.on("end", () => {
          fs.readFile("user.txt", "utf-8", (err, data) => {
            if (err) console.log(err);
    
            if (body == data) {
              res.end("successful");
            } else {
              res.end("invalid");
            }
          });
        });
      }
  }).listen(8000,()=>{
    console.log(`server running ...`);
  })
 }, 2000);

