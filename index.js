const {Chat} = require('tui-chat-components'), {Form} = require('tui-chat-components');



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
            form.clear();
            firstchat(login);
    });

    form.render();
    
}

function firstchat(login){

    //let chat = new Chat('Grimtek');
    let chat = new Chat(login.username);


    console.log(chat);

        chat.addPrompt(function(msg){})


    chat.render();
}

loginForm();