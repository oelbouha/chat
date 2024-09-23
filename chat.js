const template = document.createElement('template');

template.innerHTML = /*html*/`
<style>
    @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');

    :host {
        display: block;
        height: 100%;
    }

    .chat-container {
        height: 100vh;
    }

    #convo-list {
        width: 300px;
        min-width: 250px;
        background-color: #f8f9fa;
        border-right: 1px solid #dee2e6;
    }

    #convo-messages {
        background-color: #e0e0e0;
        flex-grow: 1;
    }

    #user-profile {
        background-color: #f8f9fa;
        border-left: 1px solid #dee2e6;
    }

    .members_container {
        overflow-y: auto;
        max-height: calc(100vh - 120px);
    }

	#user-profile .min {
		display: none !important;
	}

    #convo-header {
        position: absolute;
        top:0;
        left:0;
        width: 100%;
        height: 4em;
        background-color: #f8f9fa;
        border-bottom: 1px solid #dee2e6;
    }

    @media (max-width: 992px) {
		#user-profile .min {
			display: initial !important;
		}
        #user-profile .max {
            display: none !important;
        }

		#user-profile {
			position: absolute;
			top: 0;
			right: 0;
		}
    }
</style>

<div class="container-fluid chat-container p-0">
    <div class="d-flex h-100 position-relative">
        <div id="convo-list" class="p-3">
            <h4 class="mb-3">Chats</h5>
            <input type="search" id="convo-search" class="form-control mb-3" placeholder="Search users">
            <div class="members_container"></div>
        </div>
        <div id="convo-messages" class="position-relative"></div>
        <div id="user-profile" class="p-3 col-2">
			<div class="min">minified</div>
			<div class="max">
				<h4 class="mb-3"> Profile </h4>
			</div>
		</div>

    </div>
</div>
`;

class Chat extends HTMLElement {
    constructor() {
        super();
        
        const shadowRoot = this.attachShadow({mode:'open'});
        let templateClone = template.content.cloneNode(true);
        shadowRoot.append(templateClone);        

        this.convo_list_users = ['bob', 'mohamed', 'ahmed', 'zohair']; 
        this.activeMember = null;
    }

    handleMemberClick(event) {
        const username = event.detail.username;
        const profilePic = event.detail.profilePic;

        if (this.activeMember) {
            this.activeMember.deactivate();
        }

        const mem = event.target;
        mem.activate();
        this.activeMember = mem;

        
        // load the conversation
        const chatConversation = this.shadowRoot.querySelector('#convo-messages');
        chatConversation.innerHTML = ``;
        const wpChatconversation = document.createElement('wp-chat-conversation');
        
        wpChatconversation.setAttribute('username', username);
        wpChatconversation.setAttribute('profile-pic', profilePic);
        
        chatConversation.appendChild(wpChatconversation);
        
        
        /// load the profile info
        const profileElement = this.shadowRoot.querySelector('#user-profile');
        profileElement.innerHTML = ``;
        const wpProfile = document.createElement('wp-chat-profile');
        
        wpProfile.setAttribute('username', username);
        wpProfile.setAttribute('profile-pic', profilePic);

        profileElement.appendChild(wpProfile);
        
    }
    
    connectedCallback() {
        this.render();
        this.shadowRoot.addEventListener('memberClicked', this.handleMemberClick.bind(this));
    }
    
    render() {
        const membersContainer = this.shadowRoot.querySelector('.members_container');
        
        this.convo_list_users.forEach(username => {
            const memberElement = document.createElement('wp-chat-member');
            memberElement.setAttribute('username', username);
            memberElement.setAttribute('profile-pic', `person.png`);
            memberElement.setAttribute('last-message', 'hello there!');
            membersContainer.appendChild(memberElement);
        });
    }
}



/*    Chat Members  web component    */



const chatMemberTemplate = document.createElement('template');

chatMemberTemplate.innerHTML = /*html*/ `

    <style>
        @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');

        :host {
            display: block;
            margin-bottom: 10px;
        }
        .member {
            display: flex;
            flex-direction: row;
            padding: 1em;
            cursor: pointer;
            border-bottom: 1px solid #e9ecef;
        }
        .member:hover, .member.active {
            background-color: #e9ecef;
        }

        .profile-pic {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 14px;
            background-color: #4b3a3a;
        }

        .user-info {
        }

        .username {
            font-weight: bold;
            margin-bottom: 2px;
        }

        .last-message {
            font-size: 0.8em;
            color: #6c757d;
        }

    </style>

    <div class="member">
        <div class="profile-pic">
            <img id="user-image" src="/api/placeholder/50/50" alt="profile picture" class="img-fluid">
        </div>
        <div class="user-info">
            <div class="username"></div>
            <div class="last-message">Last message ...</div>
        </div>
    </div>
`;


class chatMember extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode:'open'});
		this.shadowRoot.appendChild(chatMemberTemplate.content.cloneNode(true));

		this.isActive = false;
	}

	activate() {
		this.isActive = true;
		this.updateStyle();
	}

	deactivate() {
		this.isActive = false;
		this.updateStyle();
	}

	updateStyle() {
		const member = this.shadowRoot.querySelector('.member');
		if (this.isActive)
			member.classList.add('active');
		else
			member.classList.remove('active');
	}

	handleClick() {
		const username = this.getAttribute('username');
        const profilePic = this.getAttribute('profile-pic');

		this.dispatchEvent(new CustomEvent('memberClicked', {
			bubbles: true,
			composed: true,
			detail: { username , profilePic}
		}));
	}

	connectedCallback() {
		this.render();
		this.shadowRoot.querySelector('.member').addEventListener('click', this.handleClick.bind(this));
	}
	
	render() {
		const username = this.getAttribute('username' || 'Unknown User');
		const profilePic = this.getAttribute('profile-pic');
		const userLastMessage = this.getAttribute('last-message' || 'No message yet');

		const userNameElement = this.shadowRoot.querySelector('.username');
		const profilePicElement = this.shadowRoot.querySelector('#user-image');
		const lastMessageElement = this.shadowRoot.querySelector('.last-message');

		userNameElement.textContent = username;
		profilePicElement.src = profilePic;
		lastMessageElement.textContent = userLastMessage;

		this.updateStyle();
	}

	static get observedAttributes() {
		return ['username', 'profile-pic', 'last-message'];
	}
}




/*    conversation web component    */


const ConversationTemplate = document.createElement('template');

ConversationTemplate.innerHTML = /*html*/ `
    <style>
         @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
        
        :host {
            display: block;
            height: 100%;
        }
        
        .profile-pic {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 14px;
            background-color: #4b3a3a;
            overflow: hidden;
        }
        
        #conversation {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        #convo-header {
            flex: 0 0 auto;
            background-color: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
        }

        #convo-messages {
            flex: 1 1 auto;
            overflow-y: auto;
            padding-bottom: 4em; /* Make room for the input container */
        }
        
        #input-message-container {
            flex: 0 0 auto;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            background-color: #f8f9fa;
            border-top: 1px solid #dee2e6;
            padding: 0.5em;
            box-sizing: border-box;
        }
        
        .message-input {
            flex-grow: 1;
            margin: 0 10px;
            border-radius: 8px;
            border: none;
            background-color: #dee2e6;
            padding: 0.5em;
        }

        .last-message {
            font-size: 0.8em;
            color: #6c757d;
        }
        .member {
            display: flex;
            align-items: center;
            padding: 1em;
            border-bottom: 1px solid #e9ecef;
        }
        .user-info {
            font-weight: bold;
        }
        .plus {
            cursor: pointer;
            font-size: 2em;
        }
    </style>
    <div id="conversation">
        <div id="convo-header">
            <div class="member">
                <div class="profile-pic">
                    <img id="user-image" src="/api/placeholder/50/50" alt="profile picture" class="img-fluid">
                </div>
                <div class="user-info">
                    <div class="username">username</div>
                </div>
            </div>
        </div>
        
        <div id="convo-messages" class="p-3"> this is the messages</div>

        <div id="input-message-container">
            <div class="plus"> + </div>
            <input class="message-input" type="text" placeholder="Type a message">
            <button class="btn btn-primary" type="submit">Send</button>
        </div>
    </div>
`;


class Conversation extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode:'open'});
		this.shadowRoot.appendChild(ConversationTemplate.content.cloneNode(true));

	}

	connectedCallback() {
		this.render();
	}

	render() {
        const username = this.getAttribute('username');
        const userProfilePic = this.getAttribute('profile-pic');

        // console.log("profile pic " ,userProfilePic);

        const userNmaeElement = this.shadowRoot.querySelector('.username');
        userNmaeElement.textContent = username;

        const userProfilePicElement = this.shadowRoot.querySelector('#user-image');
        userProfilePicElement.src = userProfilePic;

        const userMessages = this.shadowRoot.querySelector('#convo-messages');
        userMessages.innerHTML = `
            <p> conversation with ${username} </p>
            <p> last message </p>
        `;
	}

    static get observedAttributes() {
		return ['username', 'profile-pic', 'last-message'];
	}
}


/*******      profile  Component ******/

const profileTemplate = document.createElement('template');

profileTemplate.innerHTML = /*html*/ `
    <style>
         @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
        
        :host {
            display: block;
            height: 100%;
        }
        
    .profile-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    #user-image {
        width: 200px;
        height: 200px;
        overflow: hidden;
        border-radius: 50%;
        background-color: #dee2e6;
    }

    .user-info {
        width: 100%;
        height: 100px;
        border: 1px solid black;
    }

    </style>
    <div class="profile-info p-3">
        <img id="user-image" src="/api/placeholder/50/50" alt="profile picture">
        <h4 class="username"></h4>
    </div>

`;

class Profile extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:'open'});
        this.shadowRoot.appendChild(profileTemplate.content.cloneNode(true));
    
    }
    
    connectedCallback() {
        this.render();
    }
    
    render() {
        const username = this.getAttribute('username');
        const userProfilePic = this.getAttribute('profile-pic');
    
        const userImageElement = this.shadowRoot.querySelector('#user-image');
        const usernameElement = this.shadowRoot.querySelector('.username');
        userImageElement.src = userProfilePic;
        usernameElement.textContent = username;
    }
    
    static get observedAttributes() {
        return ['username', 'profile-pic', 'last-message'];
    }
    
}

customElements.define("wp-chat", Chat);
customElements.define("wp-chat-member", chatMember);
customElements.define("wp-chat-conversation", Conversation);
customElements.define("wp-chat-profile", Profile);

