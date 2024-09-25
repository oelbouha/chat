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

    .chat-header {
    }

    #convo-search {

    }
    .search-container {
        position: relative;
    }
    .search-icon {
        position: absolute;
        left: 1em;
        
        top: 50%;
        transform: translateY(-50%);

        width: 1.5rem;
        height: 1.5rem;
        pointer-events: none;
    }

    #convo-search:focus {
            outline: none;
            border-color: #ccc;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    }

    #convo-search {
        padding-left: 3rem;
    }
    @media (max-width: 992px) {
		#user-profile {
			display: none !important;
		}
        
    }
</style>

<div class="container-fluid chat-container p-0">
    <div class="d-flex h-100 position-relative">
        <div id="convo-list" class="p-3">
            <h4 class="chat-header mb-3">Chats</h5>
            <div class="search-container">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <input type="search" id="convo-search" class="form-control mb-3" placeholder="Search">
            </div>
            <div class="members_container"></div>
        </div>
        <div id="convo-messages" class="position-relative"></div>
        <div id="user-profile">
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
        // const chatConversation = this.shadowRoot.querySelector('#convo-messages');
        // chatConversation.innerHTML = ``;
        // const wpChatconversation = document.createElement('wp-chat-conversation');
        
        // wpChatconversation.setAttribute('username', username);
        // wpChatconversation.setAttribute('profile-pic', profilePic);
        
        // chatConversation.appendChild(wpChatconversation);
        
        
        // /// load the profile info
        // const profileElement = this.shadowRoot.querySelector('#user-profile');
        // profileElement.innerHTML = ``;
        // const wpProfile = document.createElement('wp-chat-profile');
        
        // wpProfile.setAttribute('username', username);
        // wpProfile.setAttribute('profile-pic', profilePic);

        // profileElement.appendChild(wpProfile);
        
    }
    
    handleSearch(event)  {
        const searchQuery = event.target.value.toLowerCase();
        const membersContainer = this.shadowRoot.querySelector('.members_container');
        const members = this.shadowRoot.querySelectorAll('wp-chat-member');
    
        this.convo_list_users.forEach(username => {
            const member = members.item(this.convo_list_users.indexOf(username));

            if (username.toLowerCase().includes(searchQuery)) {
                member.classList.remove('d-none');
            } else {
                member.classList.add('d-none');
            }
        });
    }
    connectedCallback() {
        this.render();
        this.shadowRoot.addEventListener('memberClicked', this.handleMemberClick.bind(this));
        this.shadowRoot.querySelector('#convo-search').addEventListener('input', this.handleSearch.bind(this));
    }
    

    render() {
        const membersContainer = this.shadowRoot.querySelector('.members_container');
        

        //// for test
        const username = "mohhamed";
        const profilePic = "assets/after.png";
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
        /////


        this.convo_list_users.forEach(username => {
            const memberElement = document.createElement('wp-chat-member');
            memberElement.setAttribute('username', username);
            memberElement.setAttribute('profile-pic', `assets/after.png`);
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
            background-color: #e0e0e0;
        }

        .profile-pic {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 14px;
            overflow: hidden;
            object-fit: cover;
        }

        .user-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .user-name {
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
            <img class="user-image" src="/api/placeholder/50/50" alt="profile picture" >
        </div>
        <div class="user-info">
            <div class="user-name"></div>
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

		const userNameElement = this.shadowRoot.querySelector('.user-name');
		const profilePicElement = this.shadowRoot.querySelector('.user-image');
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
            overflow: hidden;
        }
        .user-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        #conversation {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        #convo-header {
            flex: 0 0 auto;
            height: 5em;
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
            padding: 0.5em;
            box-sizing: border-box;
        }
        
        #message-input {
            flex-grow: 1;
            margin: 0 10px;
            border-radius: 8px;
            border: 1.5px solid #dee2e6;;
            background-color: none;
            padding: 0.5em;
        }
        #message-input:focus {
            outline: none;
            border-color: #ccc;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
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

        .add-image-icon {
            cursor: pointer;
            width: 25px;
            height: 25px;
        }

        #send-btn-icon {
            cursor: pointer;
            width: 25px;
            height: 25px;
            display: none;
        }
        #send-btn-icon.visible {
            display: block;
        }

    </style>
    <div id="conversation">
        <div id="convo-header">
            <div class="member">
                <div class="profile-pic">
                    <img class="user-image" src="/api/placeholder/50/50" alt="profile picture" class="img-fluid">
                </div>
                <div class="user-info">
                    <div class="user-name">username</div>
                </div>
            </div>
        </div>
        
        <div id="convo-messages" class="p-3"> this is the messages</div>

        <div id="input-message-container">
                <svg class="add-image-icon" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24">
                    <path d="m16,7c0,1.105-.895,2-2,2s-2-.895-2-2,.895-2,2-2,2,.895,2,2Zm6.5,11h-1.5v-1.5c0-.828-.671-1.5-1.5-1.5s-1.5.672-1.5,1.5v1.5h-1.5c-.829,0-1.5.672-1.5,1.5s.671,1.5,1.5,1.5h1.5v1.5c0,.828.671,1.5,1.5,1.5s1.5-.672,1.5-1.5v-1.5h1.5c.829,0,1.5-.672,1.5-1.5s-.671-1.5-1.5-1.5Zm-6.5-3l-4.923-4.923c-1.423-1.423-3.731-1.423-5.154,0l-2.923,2.923v-7.5c0-1.379,1.122-2.5,2.5-2.5h10c1.378,0,2.5,1.121,2.5,2.5v6c0,.828.671,1.5,1.5,1.5s1.5-.672,1.5-1.5v-6c0-3.032-2.467-5.5-5.5-5.5H5.5C2.467,0,0,2.468,0,5.5v10c0,3.032,2.467,5.5,5.5,5.5h6c.829,0,1.5-.672,1.5-1.5v-.5c0-1.657,1.343-3,3-3v-1Z"/>
                </svg>
            <input id="message-input" type="text" placeholder="Type a message">
            <svg id="send-btn-icon" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512"><path d="m4.034.282C2.981-.22,1.748-.037.893.749.054,1.521-.22,2.657.18,3.717l4.528,8.288L.264,20.288c-.396,1.061-.121,2.196.719,2.966.524.479,1.19.734,1.887.734.441,0,.895-.102,1.332-.312l19.769-11.678L4.034.282Zm-2.002,2.676c-.114-.381.108-.64.214-.736.095-.087.433-.348.895-.149l15.185,8.928H6.438L2.032,2.958Zm1.229,18.954c-.472.228-.829-.044-.928-.134-.105-.097-.329-.355-.214-.737l4.324-8.041h11.898L3.261,21.912Z"/>
            </svg>
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

        this.shadowRoot.querySelector('#message-input').addEventListener('input', this.handleMessage.bind(this));
	}

    handleMessage(event) {
        const sendBtnIcon = this.shadowRoot.querySelector('#send-btn-icon');

        const message = event.target.value;
        if (message) {
            sendBtnIcon.classList.add('visible');
        }
        else {
            sendBtnIcon.classList.remove('visible');
        }

    }

	render() {
        const username = this.getAttribute('username');
        const userProfilePic = this.getAttribute('profile-pic');

        // console.log("profile pic " ,userProfilePic);

        const userNmaeElement = this.shadowRoot.querySelector('.user-name');
        userNmaeElement.textContent = username;

        const userProfilePicElement = this.shadowRoot.querySelector('.user-image');
        userProfilePicElement.src = userProfilePic;

        const userMessages = this.shadowRoot.querySelector('#convo-messages');
        userMessages.textContent = '';
        const wp_message = document.createElement('wp-message');
        userMessages.appendChild(wp_message);
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
        
    .profile-container {
        display: flex;
        flex-direction: column;
        gap: 1em;
        height: 100%;
        overflow-y: auto;
    }

    .profile-pic {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 300px;
        height: 300px;
        background-color: #e0e0e0;
        border-radius: 14px;
    }
    .user-image {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        object-fit: cover;
    }

    
    .profile-header {
        font-weight: bold;
    }

    #user-profile-info {
        background-color: #e0e0e0;
        border-radius: 14px;
    }

    </style>
    <div class="profile-container p-3">
        <div class="profile-header">
            <h3 >Profile info</h3>
        </div>
        
        <div class="profile-pic">
            <img class="user-image" src="/api/placeholder/50/50" alt="profile picture">
            <h4 class="user-name"></h4>
        </div>
        <div id="user-profile-info" class="p-3"></div>
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
        
        const userProfileInfo = this.shadowRoot.querySelector('#user-profile-info');
        const wp_userProfileInfo = document.createElement('wp-card');
        
        for (let i = 0; i < 4; ++i) {
            const mem = document.createElement('wp-card');
            userProfileInfo.appendChild(mem);
        }

    
        const userImageElement = this.shadowRoot.querySelector('.user-image');
        const usernameElement = this.shadowRoot.querySelector('.user-name');
        const min = this.shadowRoot.querySelector('.min');
        console.log("min :: ", min);

        userImageElement.src = userProfilePic;
        usernameElement.textContent = username;
    }
    
    static get observedAttributes() {
        return ['username', 'profile-pic', 'last-message'];
    }
    
}

const cardTemplate = document.createElement('template');

cardTemplate.innerHTML = /*html*/ `
    <style>
        @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');

        :host {
            display: block;
            width: 100%;
        }
        
        #card-container {
            display: flex;
            flex-direction: column;
        }
        
        .card-icon {
            margin-top: 5px;
            width: 15px;
            height: 15px;
        }
        
        .card-body-container {
            margin-left: 0.5em;
            display: flex;
            gap: 10px;
            justify-content: start;
        }

    </style>
    <div id="card-container">
        <div class="card-header">
            <h5> Header </h5>
        </div>
        <div class="card-body-container">
            <svg class="card-icon" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512"><path d="m16,23.314c-1.252.444-2.598.686-4,.686s-2.748-.242-4-.686v-2.314c0-2.206,1.794-4,4-4s4,1.794,4,4v2.314ZM12,7c-1.103,0-2,.897-2,2s.897,2,2,2,2-.897,2-2-.897-2-2-2Zm12,5c0,4.433-2.416,8.311-6,10.389v-1.389c0-3.309-2.691-6-6-6s-6,2.691-6,6v1.389C2.416,20.311,0,16.433,0,12,0,5.383,5.383,0,12,0s12,5.383,12,12Zm-8-3c0-2.206-1.794-4-4-4s-4,1.794-4,4,1.794,4,4,4,4-1.794,4-4Z"/></svg>
            <p id="card-body">this is the body </p>
        </div>
    </div>
`;

class Card extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:'open'});
        this.shadowRoot.appendChild(cardTemplate.content.cloneNode(true));
    
    }
    
    connectedCallback() {
        this.render();
    }
    
    render() {
       
    }
    
    static get observedAttributes() {
        return ['username', 'profile-pic', 'last-message'];
    }
    
}



const messageTemplate = document.createElement('template');

messageTemplate.innerHTML = /*html*/ `
	<style>
		 @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
         
		.message-container {
			display: flex;
		}
		.message {
			background-color: #282c34;
			color: white;
			padding: 10px 12px;
			border-radius: 7.5px;
			font-size: 14px;
		}
		.message-time {
			color: white;
			position: absolute;
			bottom: 4%;
			right: 5%;
		}
		
	</style>
	<div class="message-container m-4">
		<div class="message p-2 position-relative">
			<p>Hello, how are you  fdfdfdfdfdfdfd?</p>
			<div class="message-time" >
				10:30 AM
			</div>
		</div>
  </div>
`;

class Message extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode:'open'});
        this.shadowRoot.appendChild(messageTemplate.content.cloneNode(true));
	}

    connectedCallback() {
        this.render();
    }
	
	getCurrentTime() {
		const now = new Date();
		return now.toLocaleTimeString([], {hour:'2-digit', minute: '2-digit'});
	}

	render() {
		const mesaageContainer = this.shadowRoot.querySelector('.message-container');
		const time = this.getCurrentTime();
		
		const timeElement = this.shadowRoot.querySelector('.message-time');
		timeElement.textContent = time;

	}
}



customElements.define("wp-chat", Chat);
customElements.define("wp-chat-member", chatMember);
customElements.define("wp-chat-conversation", Conversation);
customElements.define("wp-chat-profile", Profile);
customElements.define("wp-card", Card);
customElements.define("wp-message", Message);


