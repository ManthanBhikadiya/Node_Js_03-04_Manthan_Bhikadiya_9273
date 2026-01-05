const http = require('http')

const port = 3040

const server = http.createServer((req , res)=>{
    res.end('This is custom server using HTTP')
})

server.listen(port,()=>{
    console.log(`server runing on ${port}`)
})