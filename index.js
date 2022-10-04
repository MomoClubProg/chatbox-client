const {Chat} = require('tui-chat-components'), {Form} = require('tui-chat-components');



function loginForm(){

    let form = new Form();


    form.addPrompt('username');
    form.addPrompt('IP');
    form.addPrompt('Port');
    form.addPrompt('Channel');

    form.addSubmit(function(login){});

    form.render();
}

function firstchat(){

    let chat = new Chat('Grimtek');

    chat.addMessage('Grimtek', 'Hello There');

    console.log(chat);

        chat.addPrompt(function(msg){})

    chat.render();
}

loginForm();

firstchat();