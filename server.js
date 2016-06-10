var http = require("http");
var fs = require("fs");
var path = require("path");
var replace = require("./replace");  
var multContains = require("./contains")

var hostname='0.0.0.0'
var port = 8080;

var server = http.createServer(function(req, res){
    
    console.log("Request for "+req.url+" by method "+req.method);
    
    if(req.method == 'POST'){
        
        //console.log(req);
        req.on('data', function(data) {
            console.log("Received body data:");

            var inData = JSON.parse('{"'+replace.replaceAll(replace.replaceAll(data.toString(),'=','":"'),'&','","')+'"}');
            
            var message = {"message":inData.message};
            if(inData.message.indexOf("%3C") != -1)
                message = JSON.parse("{"+inData.message.replace("%3C%40",'"botUser":"').replace("%3E",'",').replace("%3A+",'"message":"')+'"}');
                
            message.user = inData.user;
            message.message = unescape(replace.replaceAll(message.message,'\\+'," "));
                
            console.log(message);
            
            console.log("Waiting");
            
            setTimeout(function(){
                console.log("Serving")
                // empty 200 OK response for now
                res.writeHead(200, {'Content-Type': 'text/plain'});
                if(!multContains.multicontains(message.message,["hi","hey","help","howdy","hello","attachment","joke"]) && message.botUser)
                    res.end("returnA nice sample message with some hidden sauce.\nEchoing:\n"+message.message);
                else if(!message.botUser)
                    res.end("returnAre you talking to me?");
                else
                    res.end("normal flow");
                    
                fs.readFile('res/test', 'utf8', function (err,data) {
                    if (err) 
                        return console.log("Error: "+err);
                    console.log("Previous File contents:"+data);
                  
                    fs.writeFile("res/test", "User: "+message.user+"\nMessage: "+message.message, function(err) {
                        if(err)
                            return console.log(err);
                    
                        console.log("The file was saved!");
                    }); 
                });
                
            },200)
            
            
        });
        
        
    }
    else if(req.method == 'GET'){
        
        console.log(req);
        
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end("<h1>Get return</h1>");
    }
    
    // not get request
    else{
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end("<h1>Error 404: "+req.method+" not supported</h1>");
    }
    
    
});

server.listen(port, hostname, 511, function(){
    console.log("Started server");
});