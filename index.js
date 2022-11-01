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

            socket.emit('login', login);

            let loginmsg = {username: 'BOT', message: login.username+' has logged in!', Channel: login.Channel};
            //socket.emit('sendMessage', loginmsg);


            form.clear();
            firstchat(login);

    });

    form.render();
    
}

function firstchat(login){

    let chat = new Chat(login.username);


    console.log(chat);

    chat.addPrompt(function({ user, message, userTag }){
        socket.emit('sendMessage', {
            username:user,
            message,
            userTag
        });

        //this.addMessage(msg);
    });

    socket.on('postMessage', (msg) => {
        //console.log(chatmsg.message);
        chat.addMessage(msg.username, msg.message);

    });

    socket.on('loginResponse', (data) => {
        //console.log(data);

        for(let i=0; i<data.length;i++){
            
            chat.addMessage(data[i].username, data[i].message);
        }
    });

    chat.render();
}



loginForm();
//comms();
