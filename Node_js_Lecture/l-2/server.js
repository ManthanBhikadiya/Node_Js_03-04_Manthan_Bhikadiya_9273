const { log } = require('console');
const fs = require('fs');
const http = require('http');

const port = 9000

const request = (req,res)=>{
    let fileName =""
    switch(req.url){
        case '/':fileName='./index.html'
        break
        case '/home':fileName='./home.html'
        break
    }
    fs.readFile(fileName,(err,data)=>{
        if(!err){
            res.end(data)
        }
    })
}

const server = http.createServer(request)

server.listen(port,(err)=>{
    if(!err){
        console.log('server start')
    }else{
        console.log('server not running');
    }
})