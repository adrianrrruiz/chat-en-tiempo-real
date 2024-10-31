import { Component } from '@angular/core';
import { io } from 'socket.io-client';

interface Message {
  content: string;
  sender: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messageInput = '';
  messages: Message[] = [];
  socket = io('http://localhost:3000'); // Cambia la URL si tu servidor está en otra dirección

  constructor() {
    // Escucha mensajes desde el servidor
    this.socket.on('newMessage', (msg: string) => {
      this.messages.push({ content: msg, sender: 'other' });
    });
  }

  sendMessage() {
    if (this.messageInput.trim()) {
      const msg = this.messageInput;
      this.messages.push({ content: msg, sender: 'me' });
      this.socket.emit('newMessage', msg); // Envía el mensaje al servidor
      this.messageInput = '';
    }
  }
}
