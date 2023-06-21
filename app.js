const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Daftar pengguna beserta ID mereka
const users = {};

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('Klien terhubung');

  // Mengirimkan ID pengguna ke klien yang baru terhubung
  socket.emit('userId', socket.id);

  // Menerima pesan dari klien dan mengirimkannya ke pengguna lain
  socket.on('sendMessage', (data) => {
    const { recipientId, message } = data;
    console.log('Pesan diterima:', message);

    const recipientSocket = io.sockets.sockets.get(recipientId);

    if (recipientSocket) {
      recipientSocket.emit('pesan', {
        senderId: socket.id,
        message: message
      });
    } else {
      console.log('Koneksi penerima tidak ditemukan');
    }
  });

  socket.on('disconnect', () => {
    console.log('Klien terputus');
    // Menghapus pengguna dari daftar saat mereka terputus
    delete users[socket.id];
  });
});

server.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
