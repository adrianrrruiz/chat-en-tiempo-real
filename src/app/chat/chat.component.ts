import { Component } from '@angular/core';
import { io } from 'socket.io-client';

interface Message {
  content: string;
  sender: string;
  self?: boolean;
  system?: boolean; // Indica si es un mensaje del sistema
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  username = ''; // Almacena el nombre del usuario
  messageInput = '';
  messages: Message[] = [];
  socket = io('http://localhost:3000');
  isUsernameSet = false; // Verifica si el nombre de usuario ya fue ingresado

  constructor() {
    // Escucha mensajes desde el servidor
    this.socket.on('newMessage', (msg: { content: string; sender: string }) => {
      this.messages.push({ content: msg.content, sender: msg.sender });
    });

    // Escucha la notificación de que un usuario se ha conectado
    this.socket.on('userConnected', (message: string) => {
      this.messages.push({ content: message, sender: 'Sistema', system: true });
    });
  }

  setUsername() {
    if (this.username.trim()) {
      this.isUsernameSet = true;
      // Notifica al servidor que este usuario se ha conectado
      this.socket.emit('userConnected', this.username);
    }
  }

  sendMessage() {
    if (this.messageInput.trim() && this.isUsernameSet) {
      const msg = {
        content: this.messageInput,
        sender: this.username // Incluye el nombre del usuario como remitente
      };
      this.messages.push({ content: msg.content, sender: 'me', self: true });
      this.socket.emit('newMessage', msg); // Envía el mensaje al servidor
      this.messageInput = '';
    }
  }
}
