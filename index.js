const {Chat, Form} = require('tui-chat-components');
const Socket = require('socket.io-client');
const MDE = require('mde_crypt');

let socket;

function loginForm(){

    let form = new Form();

    form.addPrompt('username');
    form.addPrompt('IP');
    form.addPrompt('Port');
    form.addPrompt('Channel');

    form.addSubmit((login) => {

            socket = Socket.io('http://'+login.IP+':'+login.Port);

            socket.emit('login', login);

            form.clear();
            firstchat(login);
    });
    form.render();
}

function firstchat(login){

    let chat = new Chat(login.username);
    const key = login.Channel;


    chat.addPrompt(function(data){

        let buffer = MDE.Encrypt(data.message, key);
        socket.emit('sendMessage', {
            username: data.user,
            message: buffer.data,
            userTag: data.userTag
        });
    });


    socket.on('postMessage', (msg) => {
        chat.addMessage(
          msg.username,
          MDE.Decrypt(msg.message, key).data.toString()
        );
    });

    socket.on('loginResponse', ({ data, invalid }) => {
      if (invalid) {
        chat.clear();
        loginForm();

      } 

      // Display every message
      for(let i=0; i<data.length;i++){
        let dec = MDE.Decrypt(data[i].message, key);
         
        chat.addMessage(
          data[i].username,
          dec.data.toString()
        );
      }

    });

    chat.render();
}

loginForm();
