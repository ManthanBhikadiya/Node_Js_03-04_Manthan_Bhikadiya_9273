const http = require('http');
const port = 8909

const server = http.createServer((req , res)=>{
    res.writeHead (200 , {'Content-Type': 'text/plain'});
    res.end("Hello Node.js...") ;
})

server.listen(port,(err)=>{
    !err ? console.log(`Server is running on port ${port}`) : null;
})