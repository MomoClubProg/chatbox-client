const {Chat, Form} = require('tui-chat-components');
const Socket = require('socket.io-client');
const MDE = require('mde_crypt');
const UUID = require('./get_uuid.js');
const fs = require('node:fs')

let socket;

//Login interface
function loginForm(){

    let form = new Form();

    form.addPrompt('username');
    form.addPrompt('IP');
    form.addPrompt('Port');
    form.addPrompt('Channel');

    //Login message sent to server
    form.addSubmit((login) => {



            form.clear();
            firstchat(login);
    });
    form.render();
}

function firstchat(login){

    socket = Socket.io('http://'+login.IP+':'+login.Port);
    socket.emit('login', login);

    let chat = new Chat(login.username);
    const key = login.Channel;
    const userTag = UUID.get(login.username);

    //Message encryption and sending to server
    chat.addPrompt(function(data){

        let buffer = MDE.Encrypt(data.message, key);
        socket.emit('sendMessage', {
            username: data.user,
            message: buffer.data,
            userTag
        });
    });

    //Message receiving from server and decryption
    socket.on('postMessage', (msg) => {
        // Live Messages are just buffers
      chat.addMessage(
        msg.username,
        MDE.Decrypt(msg.message, key).data,
        msg.userTag
      );
    });

    //Returns to login if form is invalid
    socket.on('loginResponse', ({ data, invalid }) => {
      if (invalid) {
        chat.clear();
        loginForm();
      } 

      // Display every message
      for(let i=0; i<data.length;i++){
        let message_string;
        if (typeof data[i].message === 'string') {
          message_string = data[i].message;
        } else {   
          message_string = 
            MDE.Decrypt(data[i].message, key).data.toString();
        }

        chat.addMessage(
          data[i].username,
          message_string,
          data[i].userTag
        );
      }

    });

    chat.render();
}

//Looks for login token and feeds the login info if file is found
if(fs.existsSync(process.argv[2])){

  rawFile = fs.readFileSync(process.argv[2], "utf-8");
  
  login = JSON.parse(rawFile);

  firstchat(login);

}else{

loginForm();
}
