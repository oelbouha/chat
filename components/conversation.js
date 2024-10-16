import { websocket } from "./net.js";

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
        this.messages = [];
        
        // client messages 
        this.clientMessages = []
            
            
            this.render()
	    }
        

	connectedCallback() {
		
	}

    loadClientMessages(messages, activeMemberId) {
        if (!messages) return 

        const conversation = this.shadowRoot.querySelector('#conversation');
        if (!conversation) return 
        
        messages.forEach(message => {
            
            const userId = message.clt;
            const messageType = message.tp;
            const messageContent = message.cnt;
            const messageIdentifier = message.identifier
            const messageStatus = message.status

            if (message.type == "client") {
                const wpClientComponent = document.createElement('wc-client-message')
                wpClientComponent.setMessage(messageContent)
                conversation.appendChild(wpClientComponent)
               
                if (message.status != "sn") {
                    websocket.send(JSON.stringify({
                        "m": "sn",
                        "clt": activeMemberId,
                        "msg": message.msg
                    }));
                }
            }
            else {
                const wpUserComponent = document.createElement('wc-user-message');
                wpUserComponent.addMessage(messageContent, "1:30 AM");
                wpUserComponent.updateMessageStatus(message.status)
                conversation.appendChild(wpUserComponent);
            }

        });
    }

    loadUserMessages(messages) {
        if (!messages) return 
        messages.forEach(message => {
            this.displayUserMessage(message)
        });
    }
    
    // updateMessageStatus(message) {
    //     const identifier = message.identifier
    //     const messageStatus = message.m
        
        
    //     const conversation = this.shadowRoot.querySelector('#conversation');

    //     let id = "wc-user-message[message-id=\"" + message.msg + "\"]"

    //     if (message.m == "st") {
    //         id = "wc-user-message[message-id=\"" + identifier + "\"]" 
            
    //         const messageToUpdate = conversation.querySelector(id);
    //         if (messageToUpdate) {
    //             messageToUpdate.updateMessageStatus(messageStatus)
    //             messageToUpdate.setAttribute('message-id', message.msg)
    //         }
    //         return 
    //     }
        
    //     const messageToUpdate = conversation.querySelector(id);
        
    //     if (messageToUpdate) {
    //         messageToUpdate.updateMessageStatus(messageStatus)
    //     }
    // }

    
    displayUserMessage(message) {
        // this.messages.push(message)
        
        const conversation = this.shadowRoot.querySelector('#conversation');
        
        const userId = message.clt;
        const messageType = message.tp;
        const messageContent = message.cnt;
        const messageIdentifier = message.identifier
        
        setTimeout(() => {
            const wpUserComponent = document.createElement('wc-user-message');
            wpUserComponent.addMessage(messageContent, "1:30 AM");
            wpUserComponent.setAttribute("message-id", messageIdentifier);
            conversation.appendChild(wpUserComponent);
        }, 0);
    }
    
    displayClientMessage(message) {

        const userId = message.clt;
        const messageType = message.tp;
        const messageContent = message.cnt;
        const messageIdentifier = message.identifier
        
        const conversation = this.shadowRoot.querySelector('#conversation');
        if (!conversation) return 
        const wpClientComponent = document.createElement('wc-client-message')
        wpClientComponent.setMessage(messageContent)
        conversation.appendChild(wpClientComponent)
    }

	render() {
        const username = this.getAttribute('username');
        const userProfilePic = this.getAttribute('profile-pic');
        
        const conversation = this.shadowRoot.querySelector('#conversation');
        conversation.textContent = ''
        
        setTimeout(() => {
            this.messages.forEach((message) => {
                const wpUserComponent = document.createElement('wc-user-message');
                wpUserComponent.addMessage(message.cnt);
                wpUserComponent.updateMessageStatus(message.m)
                conversation.appendChild(wpUserComponent);
            });

            this.clientMessages.forEach((message) => {
                const wpClientComponent = document.createElement('wc-client-message');
                wpClientComponent.setMessage(message.cnt);
                conversation.appendChild(wpClientComponent);
            });
        })
	}

    static get observedAttributes() {
		return ['username', 'profile-pic', 'last-message'];
	}
}


/*


{ "m": "msg", "clt": 3, "tp": "txt", "identifier": 31, "cnt": "helllo" }
{ "m": "recv", "clt": 3, "msg": 951, "identifier": 0 }


jawad session id == 4
sessionid=75r0w7kvo1v7o9rcr69ez3mk9ue4fkck
*/