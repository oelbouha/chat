
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
            
            
            this.render()
	    }
        

	connectedCallback() {
		
	}

    
    updateMessageStatus(message) {
        const identifier = message.identifier
        const messageStatus = message.m

        const id = "wp-user-message[message-id=\"" + identifier + "\"]" 
        

        const conversation = this.shadowRoot.querySelector('#conversation');
        const messageToUpdate = conversation.querySelector(id);
        
        if (messageToUpdate) {
            console.log("updating message", messageToUpdate)
            messageToUpdate.updateMessageStatus(messageStatus)
        }

        
        // const Update = this.messages.find(m => m.identifier == status.identifier)
        // console.log("found ", Update)

    }

    
    displayUserMessage(message) {
        this.messages.push(message)
        
        const conversation = this.shadowRoot.querySelector('#conversation');
        
        const userId = message.clt;
        const messageType = message.tp;
        const messageContent = message.cnt;
        const messageIdentifier = message.identifier
        
        setTimeout(() => {
            const wpUserComponent = document.createElement('wp-user-message');
            wpUserComponent.setMessage(messageContent, "1:30 AM");
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
        const wpClientComponent = document.createElement('wp-client-message')
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


/*


{ "m": "msg", "clt": 3, "tp": "txt", "identifier": 31, "cnt": "helllo" }
{ "m": "recv", "clt": 3, "msg": 951, "identifier": 0 }


jawad session id == 4
sessionid=75r0w7kvo1v7o9rcr69ez3mk9ue4fkck 
*/