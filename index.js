// Creación y configuración del SERVER
const http = require('http');
const app = require('./src/app');

// Config .env
require('dotenv').config();

require('./src/config/db')

// Creación server
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT);

// Listeners
server.on('listening', () => {
    console.log(`Servidor escuchando sobre el puerto ${PORT}`);
});

server.on('error', (error) => {
    console.log(error);
})

//Config websocket (WS) server
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
})

const ChatMessage = require('./src/models/chatmessage.model')

io.on('connection', async (socket) => {
    console.log('Se ha conectado un nuevo cliente');

    let recentMessages = await ChatMessage.find().sort({ createdAt: -1 }).limit(5)
    io.emit('chat_init',
        recentMessages
    )


    socket.broadcast.emit('chat_message_server', {
        name: 'server',
        message: 'se ha conectado un nuevo usuario'
    })

    io.emit('clients_online', io.engine.clientsCount)

    socket.on('chat_message_client', async (data) => {
        await ChatMessage.create(data)
        io.emit('chat_message_server', data)
    })

    socket.on('disconnect', () => {
        io.emit('chat_message_server', {
            name: 'server',
            message: 'se ha desconectado un usuario'
        })
        io.emit('clients_online', io.engine.clientsCount)
    })


})

// Guardar todos los mensajes
