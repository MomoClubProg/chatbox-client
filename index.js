const {Chat, Form} = require('tui-chat-components');
const Socket = require('socket.io-client');

let socket;

function comms(msg){

    //let msg = {user:'Grimtek', message: 'Hello there!'};

    socket.emit('sendMessage', msg);
    
   socket.on('receivedMessage', (msg) => {

        console.log(msg);

    });
}



function loginForm(){

    let form = new Form();


    form.addPrompt('username');
    form.addPrompt('IP');
    form.addPrompt('Port');
    form.addPrompt('Channel');

    form.addSubmit((login) => {
            console.log('\n'+login.username);
            console.log(login.IP);
            console.log(login.Port);
            console.log(login.Channel);

            socket = Socket.io('http://'+login.IP+':'+login.Port);

            socket.emit('login', login.username);

            let loginping = {user: login.username, message: login.username+' has logged in!'};
            socket.emit('sendMessage', loginping);


            form.clear();
            firstchat(login);

            /*socket.on('postMessage', (chatmsg) => {
                //console.log(chatmsg.message);
                let chat1 = new Chat(login.username);

                chat1.addMessage(chatmsg);
                form.clear();
                chat1.render();
            });*/
    });

    form.render();
    
}

function firstchat(login){

    let chat = new Chat(login.username);


    console.log(chat);

    chat.addPrompt(function(msg){
        socket.emit('sendMessage', msg);

    });


    chat.render();
}



loginForm();
//comms();
