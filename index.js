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

            let loginmsg = {username: 'BOT', message: login.username+' has logged in!', Channel: login.Channel};

            form.clear();

            firstchat(login);
    });
    form.render();
}



function firstchat(login){

    let chat = new Chat(login.username);
    const key = login.Channel;

    console.log(chat);

    chat.addPrompt(function(data){

        let buffer = MDE.Encrypt(data.message, key);

        socket.emit('sendMessage', {
            username: data.user,
            message: buffer.data,
            userTag: data.userTag
        });
    });


    socket.on('postMessage', (msg) => {

        let decryp = MDE.Decrypt(msg.message, key);

        chat.addMessage(msg.username, decryp.data.toString());
    });

    socket.on('loginResponse', (data) => {

        let startdecryp;

        for(let i=0; i<data.length;i++){
            
            startdecryp = MDE.Decrypt(data[i].message, key);

            console.log(startdecryp, data[i].message);

            chat.addMessage(data[i].username, startdecryp.data.toString());
        }
    });

    chat.render();
}

loginForm();