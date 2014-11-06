/**
 * node server [--env dev]
 * 
 */


//process.argv.forEach(function (val, index, array) { 
//  console.log(index + ': ' + val);
//});

var ENVIREMENT = "prod";
if(process.argv.length > 3 && process.argv[2] == "--env" && process.argv[3] == "dev"){
    ENVIREMENT = "dev";
}
    

var 
        express = require('express')
    ,   app = express()
    ,   bodyParser = require('body-parser')
    ,   WebSocketServer = require('websocket').server; 
 
;

var users = [ /* Registred users */ 
            {
                id    : 1,
                email : "anis.bouhachem@tritux.com",
                password : "anis.bouhachem",
                username : "Anis Bouhachem",
                roles : [
                    "admin", "user", "anonymous"
                ]
            },
            {
                id    : 2,
                email : "olfa.loussaief@mail.com",
                password : "olfa.loussaief",
                username : "Olfa Loussaief",
                roles : [
                    "user", "anonymous"
                ]
            },
            {
                id    : 3,
                email : "imen.ezzine@tritux.com",
                password : "imen.ezzine",
                username : "Imen Ezzine",
                roles : [
                    "user", "anonymous"
                ]
            },
            {
                id    : 4,
                email : "abdelmalek.troudi@tritux.com",
                password : "abdelmalek.troudi",
                username : "Abdelmalek Troudi",
                roles : [
                    "user", "anonymous"
                ]
            },
            {
                id    : 5,
                email : "mahdi.raddadi@tritux.com",
                password : "mahdi.raddadi",
                username : "Mahdi Raddadi",
                roles : [
                    "user", "anonymous"
                ]
            }
        ] 
;

var sockets = [];


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

if( ENVIREMENT === "dev") {
    app.use('/docs', express.static(__dirname + '/dist/docs/'));
    app.use(express.static(__dirname + '/docular_generated/'));
    app.use(express.static(__dirname + '/app/public'));
    app.use(express.static(__dirname + '/dist'));
    app.use(express.static(__dirname + '/app'));
} else { 
    app.use(express.static(__dirname + '/dist')); 
}



var server = app.listen(process.env.PORT || 8800);

app.post('/api/auth', function(req, res) {
    ENVIREMENT === "dev" && console.log("Authentication")
    var _authenticated = false, _user = null;
    
    
    /* Query database for credentials */
    users.forEach(function(user) {
       if(req.body.username === user.email && req.body.password === user.password) {
            
            ENVIREMENT === "dev" && console.log("User found");
            _user = user;
            _authenticated = true;
           return;
       } 
    }); 
    if(_authenticated) {
        res.json({
                result : 1, 
                user : _user
        }).status(200);
    } else {
        ENVIREMENT === "dev" && console.log("User not found");
        res.json({
            result : 0  
        });
    }
   
    
});

/* SUBSCRIPTION */
app.post('/api/users', function (req, res) {
    ENVIREMENT === "dev" && console.log(req);
    res.end();
});


/* POST REST API */
 var posts = [ ];

app.get('/api/posts', function(req, res) {
    res.json(posts).status(200);
    res.end();
}); 
app.post('/api/posts', function(req, res) {
//    posts.push(req.body);
    res.end();
}); 


app.get('*', function(req, res) {
    res.end('Not Found 404');
});

  
// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);

    ENVIREMENT === "dev" && console.log("Websocket connection");
    
    
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // process WebSocket message
            ENVIREMENT === "dev" && console.log("Websocket message");
            ENVIREMENT === "dev" && console.log(message);
            
            var data = JSON.parse(message.utf8Data);
            if(data.type === 1) { 
                sockets.push(connection);
            }
            if(data.type === 2) {
                data.post.id = posts.length + 1;
                posts.push(data.post);
                for(var i =0, l = sockets.length; i<l; i+=1){
              
                    sockets[i].send(message.utf8Data);
                    
                } 
                ENVIREMENT === "dev" && console.log(sockets.length);
            }
        }
    });

    connection.on('close', function(connection) {
        // close user connection
//        sockets.splice(sockets.indexOf(connection), 1);
            ENVIREMENT === "dev" && console.log("Websocket close");
    });
});

