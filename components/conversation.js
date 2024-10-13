
const ConversationTemplate = document.createElement('template');

ConversationTemplate.innerHTML = /*html*/ `
<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title></title>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    
    <style>
         @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
        
        :host {
            display: block;
            height: 100%;
            width: 100%;
        }

        #conversation {

        }

    </style>
    </head>
    <body>
        <div id="conversation" class="p-3"> </div> 
    </body>
</html>
`;


export class conversation extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode:'open'});
		this.shadowRoot.appendChild(ConversationTemplate.content.cloneNode(true));

        // user messages
        this.messages = [{
            m: "sn",
            clt: "2",
            tp: "txt",
            cnt: "Another test message"}
        ];

        // client messages 
        this.clientMessages = [
            {
                m: "sn",
                clt: "2",
                tp: "txt",
                cnt: "Another test message"}
            ]
	    }


	connectedCallback() {
		this.render()
        this.listenForNewMessages()
	}


    listenForNewMessages() {
        document.addEventListener('newMessage', (event) => {
            console.log ("adding new message");
        })

        document.addEventListener('messageStatus', (event) => {
            const status = event.detail
            const messageToUpdate = this.messages.find(m => m.identifier == status.identifier)

            if (messageToUpdate) {
                messageToUpdate.m = status.m
                this.updateMessageStatus(status.m, status.identifier)
            }
            else
                console.log(" message not found")
        })
    }
    
    updateMessageStatus(status, identifier) {
        const id = "wp-user-message[message-id=\"" + identifier + "\"]" 
        const conversation = this.shadowRoot.querySelector('#conversation');
        const messageToUpdate = conversation.querySelector(id);

        messageToUpdate.updateMessageStatus(status)
        console.log(messageToUpdate)
    }


    renderMessages(message) {
        wpUserComponent.setMessage(message, "1:30 AM");
        wpUserComponent.updateMessageStatus("read");
    }
    
    addMessage(message) {
        this.messages.push(message)
        const conversation = this.shadowRoot.querySelector('#conversation');
        
        const userId = message.ctl;
        const messageType = message.tp;
        const messageContent = message.cnt;
        const messageIdentifier = message.identifier
        
        setTimeout(() => {
            const wpUserComponent = document.createElement('wp-user-message');
            wpUserComponent.setMessage(messageContent, "1:30 AM");
            wpUserComponent.setAttribute("message-id", messageIdentifier);
            conversation.appendChild(wpUserComponent);

            
            // this is for client
            // const wpClientComponent = document.createElement('wp-client-message')
            // wpClientComponent.setMessage(messageContent)
            // conversation.appendChild(wpClientComponent)
            
        }, 0);
    }
    
	render() {
        const username = this.getAttribute('username');
        const userProfilePic = this.getAttribute('profile-pic');
        
        const conversation = this.shadowRoot.querySelector('#conversation');
        conversation.textContent = ''
        
        setTimeout(() => {
            this.messages.forEach((message) => {
                const wpUserComponent = document.createElement('wp-user-message');
                wpUserComponent.setMessage(message.cnt);
                wpUserComponent.updateMessageStatus(message.m)
                conversation.appendChild(wpUserComponent);
            });

            this.clientMessages.forEach((message) => {
                const wpClientComponent = document.createElement('wp-client-message');
                wpClientComponent.setMessage(message.cnt);
                conversation.appendChild(wpClientComponent);
            });
        })
	}

    static get observedAttributes() {
		return ['username', 'profile-pic', 'last-message'];
	}
}