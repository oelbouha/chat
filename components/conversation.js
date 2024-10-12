
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

	}

	connectedCallback() {
		this.render();
	}

    addMessage(message, user) {
        const conversation = this.shadowRoot.querySelector('#conversation');
        
        
        const wpClientComponent = document.createElement('wp-client-message');
        const wpUserComponent = document.createElement('wp-user-message');
        // for user messages

        wpClientComponent.setAttribute("user", "client");
        

        conversation.appendChild(wpUserComponent);
        conversation.appendChild(wpClientComponent);
        const msg = conversation.querySelector('wp-message');

        setTimeout(() => {

            wpUserComponent.setMessage(message, "1:30 AM");
            wpUserComponent.updateMessageStatus("read");

            // client
            wpClientComponent.setMessage(message, "1:30 AM");



        }, 0);

    }



	render() {
        const username = this.getAttribute('username');
        const userProfilePic = this.getAttribute('profile-pic');
        
        
        // for test
        this.addMessage("ahmed", "hello");
        
        
        // const userMessages = this.shadowRoot.querySelector('#user-messages-container');
        // userMessages.textContent = '';
        // const wp_message = document.createElement('wp-message');
        // userMessages.appendChild(wp_message);
        
        // const clientMessage = this.shadowRoot.querySelector('#client-messages-container');
        // clientMessage.textContent = '';
        // const wp = document.createElement('wp-message');
        // clientMessage.appendChild(wp);
	}

    static get observedAttributes() {
		return ['username', 'profile-pic', 'last-message'];
	}
}