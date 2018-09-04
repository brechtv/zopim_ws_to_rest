# Zopim WS to REST API

Lightweight REST API in Node that uses Zopim's Websocket Realtime API, using [restify](http://restify.com).

# Getting started

```
npm install
```

```
node api.js
```

Then hit `/zopim`

## Sample response

```
{  
   "chats.active_chats":0,
   "chats.incoming_chats":0,
   "agents.agents_online":0,
   "agents.agents_away":0
}
```