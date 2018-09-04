var restify = require('restify')
var WebSocket = require('ws')

// create the server
var server = restify.createServer()

// set up the websocket
var ws_client = new WebSocket(
    'wss://rtm.zopim.com/stream', {
        headers: {
            'Authorization': 'Bearer ' + process.env.TOKEN
        }
    }
)

// subscribe to certain metrics
ws_client.on('open', function() {
    console.log('Successfully connected')
    ws_client.send(JSON.stringify({
        topic: "chats.active_chats",
        action: "subscribe"
    }))
    ws_client.send(JSON.stringify({
        topic: "chats.incoming_chats",
        action: "subscribe"
    }))
    ws_client.send(JSON.stringify({
        topic: "agents.agents_online",
        action: "subscribe"
    }))
    ws_client.send(JSON.stringify({
        topic: "agents.agents_away",
        action: "subscribe"
    }))
})

// the response format
var last_state = {
    "chats.active_chats": 0,
    "chats.incoming_chats": 0,
    "agents.agents_online": 0,
    "agents.agents_away": 0,
}

// on ws message received, update response
ws_client.addEventListener('message', function(event) {
    console.log(event.data)
    var message = JSON.parse(event.data)
    if (message.content) {
        if (message.content.data) {
            if (message.content.data.active_chats) {
                last_state["chats.active_chats"] = message.content.data.active_chats
            } else if (message.content.data.incoming_chats) {
                last_state["chats.incoming_chats"] = message.content.data.incoming_chats
            } else if (message.content.data.agents_online) {
                last_state["agents.agents_online"] = message.content.data.agents_online
            } else if (message.content.data.agents_away) {
                last_state["agents.agents_away"] = message.content.data.agents_away
            }
        }
    }
})

// listen on port
server.listen(process.env.PORT || 8080, function() {
    console.log('Running on %s', server.url)
})

// set up endpoint /zopim that returns last state 
server.get('/zopim', function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    // res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers') || 'origin, content-type, accept, location, code');
    res.send(last_state)
    next()
})