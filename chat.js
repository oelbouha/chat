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
        width: 400px;
        min-width: 300px;
        background-color: #f8f9fa;
        border-right: 1px solid #dee2e6;
        transition: width 0.3s ease;
    }


    #convo-messages {
        background-color: #e0e0e0;
        flex-grow: 1;
        transition: width 0.3s ease;
        display: flex;
        flex-direction: column;
    }

    #user-profile {
        width: 350px;
        min-width: 300px;
        background-color: #f8f9fa;
        border-left: 1px solid #dee2e6;
        transition: width 0.3s ease;
    }

    .members-container {
        overflow-y: auto;
        max-height: calc(100vh - 120px);
    }

	#user-profile .min {
		display: none !important;
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

    #convo-search, .form-control {
        padding-left: 3rem;
    }

    #convo-header {
        width: 100%;
        background-color: #f8f9fa;
        display: flex;
        flex-direction: row;
    }

    .member {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 1em;
            border-bottom: 1px solid #e9ecef;
    }

    .profile-pic {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 14px;
        overflow: hidden;
        border: 1px solid #e0e0e0;
    }

    #user-image {
            width: 100%;
            height: 100%;

            object-fit: cover;
    }
    .user-info {
        font-weight: bold;
    }

    #user-convo {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 20px;
    }
    #list-icon-container .list-icon, .profile-icon-container .profile-icon {
        display: none;
    }


        .profileOffcanvas {
            position: fixed;
            top: 0;
            right: -200%;
            height: 100%;
            background-color: #fff;
            transition: right 0.3s ease-in-out;
            z-index: 1000;
            box-shadow: -2px 0 5px rgba(0,0,0,0.1);
        }

        .list-offcanvas {
            position: fixed;
            top: 0;
            left: -200%;
            height: 100%;
            width: 300px;
            background-color: #fff;
            transition: right 0.3s ease-in-out;
            z-index: 1001;
            box-shadow: -2px 0 5px rgba(0,0,0,0.1);
        }

        .profileOffcanvas.show {
            right: 0;
        }

        .list-offcanvas.show {
            left: 0;
        }

        .profile-offcanvas-header {
            padding: 1rem;
            border-bottom: 1px solid #dee2e6;
        }

        .list-offcanvas-header {
            padding: 1rem;
            border-bottom: 1px solid #dee2e6;
        }

        .custom-offcanvas-body {

        }

        #profileOffcanvas, #list-offcanvas {
            overflow-y: auto;
        }
    
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 999;
            display: none;
        }
        
        .overlay.show {
            display: block;
        }

        #list-offcanvas-body {
        
        }

        #user-profile, #convo-header{
            display: none;
        }

        #chat-conversation {
            width: 100%;
            height: 100%;
            background-color: #e0e0e0;
            overflow-y: auto;
        }


        #input-message-container {
            display: none;
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

        .add-image-icon {
            cursor: pointer;
            width: 25px;
            height: 25px;
        }

        #send-btn-icon {
            cursor: pointer;
            width:  25px;
            height: 25px;
            display: none;
        }

        #send-btn-icon.visible {
            display: block;
        }


    @media (max-width: 1200px) {
        #user-profile {
            display: none !important    
		}
        .profile-icon-container .profile-icon {
            display: initial !important;
            width: 30px;
            height: 30px;
        }
    }
    
    @media (max-width: 576px) {
        #convo-list {
            display: none !important;
        }
        #min {
            width: 100px;
            height: 100px;
            background-color: red;
        }
        #list-icon-container .list-icon, .profile-icon-container .profile-icon {
            display: initial !important;
            width:  25px;
            height: 25px;
        }
    }
</style>

<body>
    <div class="chat-container position-relative">
        <div class="d-flex h-100 position-relative">
        <div id="convo-list" class="p-3">
                <h4 class="chat-header mb-3">Chats</h5>
                <div class="search-container">
                    <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <input type="search" id="convo-search" class="form-control mb-3" placeholder="Search">
                </div>
                <div class="members-container"></div>
            </div>

            <div id="convo-messages">
                <div id="convo-header">
                    <div class="member">             
                        <div id="user-convo">
                            <div id="list-icon-container">
                                <svg class="list-icon" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24">
                                <path d="M3.166,2.914c-1.377,0-2.166,.796-2.166,2.185s.789,2.185,2.166,2.185,2.165-.796,2.165-2.185-.789-2.185-2.165-2.185Z"/>
                                <path d="M8.745,6.099h13.255c.553,0,1-.448,1-1s-.447-1-1-1H8.745c-.553,0-1,.448-1,1s.447,1,1,1Z"/>
                                <path d="M3.166,9.815c-1.377,0-2.166,.796-2.166,2.185s.789,2.185,2.166,2.185,2.165-.796,2.165-2.185-.789-2.185-2.165-2.185Z"/>
                                <path d="M22,11H8.745c-.553,0-1,.448-1,1s.447,1,1,1h13.255c.553,0,1-.448,1-1s-.447-1-1-1Z"/>
                                <path d="M3.166,16.716c-1.377,0-2.166,.796-2.166,2.185s.789,2.185,2.166,2.185,2.165-.796,2.165-2.185-.789-2.185-2.165-2.185Z"/>
                                <path d="M22,17.901H8.745c-.553,0-1,.448-1,1s.447,1,1,1h13.255c.553,0,1-.448,1-1s-.447-1-1-1Z"/>
                              </svg>
                            </div>
                            <div class="profile-pic">
                                <img id="user-image" src="/api/placeholder/50/50" alt="profile picture" class="img-fluid">
                            </div>
                            <div class="user-info">
                                <div class="user-name">username</div>
                            </div>
                            </div>
                            <div class="profile-icon-container p-2">
                                <img class="profile-icon" src="assets/portrait.svg" >
                            </div>
                        </div>
                </div>
                <div id="chat-conversation"> </div>
                <div id="input-message-container">
                    <svg class="add-image-icon" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24">
                        <path d="m16,7c0,1.105-.895,2-2,2s-2-.895-2-2,.895-2,2-2,2,.895,2,2Zm6.5,11h-1.5v-1.5c0-.828-.671-1.5-1.5-1.5s-1.5.672-1.5,1.5v1.5h-1.5c-.829,0-1.5.672-1.5,1.5s.671,1.5,1.5,1.5h1.5v1.5c0,.828.671,1.5,1.5,1.5s1.5-.672,1.5-1.5v-1.5h1.5c.829,0,1.5-.672,1.5-1.5s-.671-1.5-1.5-1.5Zm-6.5-3l-4.923-4.923c-1.423-1.423-3.731-1.423-5.154,0l-2.923,2.923v-7.5c0-1.379,1.122-2.5,2.5-2.5h10c1.378,0,2.5,1.121,2.5,2.5v6c0,.828.671,1.5,1.5,1.5s1.5-.672,1.5-1.5v-6c0-3.032-2.467-5.5-5.5-5.5H5.5C2.467,0,0,2.468,0,5.5v10c0,3.032,2.467,5.5,5.5,5.5h6c.829,0,1.5-.672,1.5-1.5v-.5c0-1.657,1.343-3,3-3v-1Z"/>
                    </svg>
                    <input id="message-input" type="text" placeholder="Type a message">
                    <svg id="send-btn-icon" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512"><path d="m4.034.282C2.981-.22,1.748-.037.893.749.054,1.521-.22,2.657.18,3.717l4.528,8.288L.264,20.288c-.396,1.061-.121,2.196.719,2.966.524.479,1.19.734,1.887.734.441,0,.895-.102,1.332-.312l19.769-11.678L4.034.282Zm-2.002,2.676c-.114-.381.108-.64.214-.736.095-.087.433-.348.895-.149l15.185,8.928H6.438L2.032,2.958Zm1.229,18.954c-.472.228-.829-.044-.928-.134-.105-.097-.329-.355-.214-.737l4.324-8.041h11.898L3.261,21.912Z"/></svg>
                </div>
            </div>
            
            <div id="user-profile"></div>
        </div>
    </div>

    <div class="profileOffcanvas d-flex flex-column col-lg-4 col-md-4 col-sm-6 " id="profileOffcanvas">
        <div class="profile-offcanvas-header">
            <button type="button" class="btn-close" id="profileOffcanvasCloseBtn"></button>
        </div>
        <div class="custom-offcanvas-body"></div>
    </div>

    <div class="list-offcanvas" id="list-offcanvas">
        <div class="list-offcanvas-header">
            <button type="button" class="btn-close" id="listOffcanvasCloseBtn"></button>
        </div>
        <div id="list-offcanvas-body" class="p-3">
            <div class="search-container">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <input type="search" id="offcanvas-search" class="form-control mb-3" placeholder="Search">
            </div>
        </div>
    </div>

    <div class="overlay" id="overlay" ></div>
</body>
`;

class Chat extends HTMLElement {
    constructor() {
        super();
        
        const shadowRoot = this.attachShadow({mode:'open'});
        let templateClone = template.content.cloneNode(true);
        shadowRoot.append(templateClone);        

        this.convo_list_users = ['bob', 'mohamed', 'ahmed', 'zohair']; 
        this.activeMember = null;
        this.isActive = false;
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

        //  handle the conversation part
        const conversationBody = this.shadowRoot.querySelector('#convo-messages');

        const chatConversation = this.shadowRoot.querySelector('#convo-messages');
        const convoHeader = chatConversation.querySelector('#convo-header');
        convoHeader.style.display = 'block';

        const inputMessage = chatConversation.querySelector('#input-message-container');
        inputMessage.style.display = `flex`;

        const userProfileImg = convoHeader.querySelector('#user-image');
        userProfileImg.src = profilePic;
        const userName = convoHeader.querySelector('.user-name');
        userName.textContent = username;
        const conversation = chatConversation.querySelector('#chat-conversation');
        conversation.innerHTML = ``;
        const wpChatconversation = document.createElement('wp-chat-conversation');

        wpChatconversation.setAttribute('username', username);
        wpChatconversation.setAttribute('profile-pic', profilePic);
        conversation.appendChild(wpChatconversation);
        
        // /// load the profile info
        const userProfile = this.shadowRoot.querySelector('#user-profile');
        userProfile.style.display = 'block';
        userProfile.innerHTML = ``;
        const wpProfile = document.createElement('wp-chat-profile');
        wpProfile.setAttribute('username', username);
        wpProfile.setAttribute('profile-pic', profilePic);
        userProfile.appendChild(wpProfile);

        // close overlay
        this.handleOverlayClick();
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
    
    sendMessage(event) {
        const input = this.shadowRoot.querySelector('#message-input');
        const message = input.value;
        input.value = "";
        input.focus();

        const conversation = this.shadowRoot.querySelector('wp-chat-conversation');
        if (conversation) {
            conversation.addMessage(message, 'user');
        }
    }

    handleSearch(event)  {
        const searchQuery = event.target.value.toLowerCase();
        const membersContainer = this.shadowRoot.querySelector('.members-container');
        const members = membersContainer.querySelectorAll('wp-chat-member');
    
        members.forEach(member => {
            const username = member.getAttribute('username').toLowerCase();
            if (username.includes(searchQuery)) {
                member.style.display = '';
            } else {
                member.style.display = 'none';
            }
        });
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.addEventListener('memberClicked', this.handleMemberClick.bind(this));
        
        const mainSearch = this.shadowRoot.querySelector('#convo-search');
        mainSearch.addEventListener('input', this.handleSearch.bind(this));

        const profileIcon = this.shadowRoot.querySelector('.profile-icon');
        profileIcon.addEventListener('click', this.handleProfileOffCanvas.bind(this));

        const profileOffcanvasCloseBtn = this.shadowRoot.querySelector('#profileOffcanvasCloseBtn');
        profileOffcanvasCloseBtn.addEventListener('click', this.handleProfileCloseOffcanvas.bind(this));
        
        const listOffcanvas = this.shadowRoot.querySelector('#list-icon-container');
        listOffcanvas.addEventListener('click', this.handleListOffcanvas.bind(this));

        const listOffCloseBtn = this.shadowRoot.querySelector('#listOffcanvasCloseBtn');
        listOffCloseBtn.addEventListener('click', this.handlelistCloseOffcanvas.bind(this));

        const overlay = this.shadowRoot.querySelector('#overlay');
        overlay.addEventListener('click', this.handleOverlayClick.bind(this));

        const offcanvasSearch = this.shadowRoot.querySelector('#offcanvas-search');
        offcanvasSearch.addEventListener('input', this.handleOffcanvasSearch.bind(this));


        const inputMessage = this.shadowRoot.querySelector('#message-input');
        inputMessage.addEventListener('input', this.handleMessage.bind(this));
        inputMessage.addEventListener('keypress', this.handleKeyPress.bind(this));

        const sendBtn = this.shadowRoot.querySelector('#send-btn-icon');
        sendBtn.addEventListener('click', this.sendMessage.bind(this));
    }
    
    handleKeyPress(event) {
            if (event.key == "Enter")
                this.sendMessage(event);
    }
    handleListOffcanvas(event) {
        const listOffcanvasBody = this.shadowRoot.querySelector('#list-offcanvas-body');
        
        if (this.isActive == false)  {
            this.convo_list_users.forEach(username => {
                const memberElement = document.createElement('wp-chat-member');
                memberElement.setAttribute('username', username);
                memberElement.setAttribute('profile-pic', `assets/after.png`);
                memberElement.setAttribute('last-message', 'hello there!');
                listOffcanvasBody.appendChild(memberElement);
                this.isActive = true;
            });
        }

            
        const listOffcanvas = this.shadowRoot.querySelector('#list-offcanvas');
        listOffcanvas.classList.add('show');
        this.showOverlay();
    }
    
    handleOffcanvasSearch(event) {
        // need to be fixed ;
        const searchQuery = event.target.value.toLowerCase();
        console.log("search ::", searchQuery);

        const membersContainer = this.shadowRoot.querySelector('#list-offcanvas-body');
        const members = membersContainer.querySelectorAll('wp-chat-member');
    
        members.forEach(member => {
            const username = member.getAttribute('username').toLowerCase();
            if (username.includes(searchQuery)) {
                member.style.display = '';
            } else {
                member.style.display = 'none';
            }
        });
    }

    handleProfileCloseOffcanvas(event) {
        const offcanvas = this.shadowRoot.querySelector('#profileOffcanvas');
        offcanvas.classList.remove('show');
        this.hideOverlay();
    }

    handlelistCloseOffcanvas(event) {
        const listOffcanvas = this.shadowRoot.querySelector('#list-offcanvas');
        listOffcanvas.classList.remove('show');
        this.hideOverlay();
    }

    handleProfileOffCanvas(event) {
        const username = this.convo_list_users[1];
		const profilePic = "assets/after.png";

        console.log(username);
        const cprofileOffcanvasBody = this.shadowRoot.querySelector('.custom-offcanvas-body');
        cprofileOffcanvasBody.innerHTML = ``;

        const wpProfile = document.createElement('wp-chat-profile');
        wpProfile.setAttribute('username', username);
        wpProfile.setAttribute('profile-pic', profilePic);
        
        cprofileOffcanvasBody.appendChild(wpProfile);

        const profileOffcanvas = this.shadowRoot.querySelector('#profileOffcanvas');
        profileOffcanvas.classList.add('show');
        this.showOverlay();
    }

    showOverlay() {
        const overlay = this.shadowRoot.querySelector('.overlay');
        overlay.classList.add('show');
    }
    hideOverlay() {
        const overlay = this.shadowRoot.querySelector('.overlay');
        overlay.classList.remove('show');
    }
    handleOverlayClick() {
        this.handleProfileCloseOffcanvas();
        this.handlelistCloseOffcanvas();
    }


    render() {
        const membersContainer = this.shadowRoot.querySelector('.members-container');
        
        //// for test
        const username = "mohhamed";
        const profilePic = "assets/after.png";

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
            alignitems: center;
            padding: 1em;
            cursor: pointer;
            border-bottom: 1px solid #e9ecef;
            border-radius: 4px;
        }
        .member:hover, .member.active {
            background-color: #18d39e;
            color: white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
        const lastMessageElement = this.shadowRoot.querySelector('.member').querySelector('.last-message');
        
		const member = this.shadowRoot.querySelector('.member');
		if (this.isActive) {
            member.classList.add('active');
            lastMessageElement.style["color"] = `white`;
        }
        else {
            member.classList.remove('active');
            lastMessageElement.style["color"] = `#6c757d`;
        }
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
        
        .message {
            display: flex;
            flex-direction: column;
            margin-bottom: 15px;
        }

        #conversation {
            overflow-y: auto;
        }
        
        .message-content {
            max-width: 80%;
            padding: 10px 15px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
            background-color: red;
        }

        .user-message {
            align-items: flex-end;
        }
        .user-message .message-content {
            background-color: #18d39e;
            color: #fff;
            border-bottom-right-radius: 2px;
        }

        .client-message {
            align-items: flex-start;
        }
        .client-message .message-content {
            background-color: #e9e9eb;
            color: #000;
            border-bottom-left-radius: 4px;
        }

        .message-time {
            font-size: 12px;
            color: #888;
        }

    </style>
    </head>
    <body>
        <div id="conversation" class="p-3">
        </div>
        
    </body>
</html>
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

    addMessage(message, user) {
        const conversation = this.shadowRoot.querySelector('#conversation');

        const userMessageContainer = document.createElement('div');
        userMessageContainer.setAttribute('class',"message user-message");
        
        const userMessage = document.createElement('div');
        userMessage.setAttribute('class', 'message-content');
        userMessage.textContent = message;
       
        const userMessageTime = document.createElement('div');
        userMessageTime.setAttribute('class', 'message-time');
        userMessageTime.textContent = "10:30AM";
        
        
        userMessageContainer.appendChild(userMessage);
        userMessageContainer.appendChild(userMessageTime);
        conversation.appendChild(userMessageContainer);
        
        const clientMessageContainer = document.createElement('div');
        clientMessageContainer.setAttribute('class',"message client-message");
        const clientMessage = document.createElement('div');
        clientMessage.setAttribute('class', 'message-content');
        clientMessage.textContent = message;
        
        const clientMessageTime = document.createElement('div');
        clientMessageTime.setAttribute('class', 'message-time');
        clientMessageTime.textContent = "10:30AM";

        clientMessageContainer.appendChild(clientMessage);
        clientMessageContainer.appendChild(clientMessageTime);
        conversation.appendChild(clientMessageContainer);
        this.scrollToBottom();
    }



	render() {
        const username = this.getAttribute('username');
        const userProfilePic = this.getAttribute('profile-pic');

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


/*******      profile  Component ******/

const profileTemplate = document.createElement('template');

profileTemplate.innerHTML = /*html*/ `
    <style>
         @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
        
        :host {
            display: block;
        }
        
    .profile-container {
        display: flex;
        flex-direction: column;
        gap: 1em;
        height: 100%;
        width: 100%;
        overflow-y: auto;
    }

    .profile-pic {
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #18d39e;
        border-radius: 14px;
    }
    .user-image {
        width:  150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
    }

    
    .profile-header {
        font-weight: bold;
    }

    #user-profile-info {
        color: white;
        background-color: #18d39e;
        border-radius: 14px;
    }

    </style>
    <div class="profile-container p-4">
        <div class="profile-header">
            <h3 >Profile info</h3>
        </div>
        
        <div class="profile-pic p-3">
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
        
        
        
        // set username
        const wp_card = document.createElement('wp-card');
        const userNameIcon = "assets/circle-user.svg";
        const userName = this.getAttribute('username');
        wp_card.setAttribute('svg-path', userNameIcon);
        wp_card.setAttribute('header', "username");
        wp_card.setAttribute('body', userName);
        userProfileInfo.appendChild(wp_card);
        
        // set phone number
        const phoneNUmberIcon = "assets/phone.svg";
        const phone = "06365489752"; //this.getAttribute('phonenumber');
        const wp_phone = document.createElement('wp-card');
        wp_phone.setAttribute('svg-path', phoneNUmberIcon);
        wp_phone.setAttribute('header', "Phone number");
        wp_phone.setAttribute('body', phone);
        userProfileInfo.appendChild(wp_phone);
        
        // set description
        const descriptionIcon = "assets/description.svg";
        const description = "this is a description ..."; //this.getAttribute('description');
        const wp_description = document.createElement('wp-card');
        wp_description.setAttribute('svg-path', descriptionIcon);
        wp_description.setAttribute('header', "Description");
        wp_description.setAttribute('body', description);
        userProfileInfo.appendChild(wp_description);

    
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
            height: 100%;
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
        
        .body-container {
            display: flex;
            flex-direction: row;
            gap: 8px;
            width: 100%;
        }

        .card-header {
            font-weight: bold;
        }

    </style>
    <div id="card-container">
        <div class="card-header">
            <p> Header </p>
        </div>
        <div class="body-container">
            <img class="card-icon" src="list.svg" alt="svg">
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
        const svgPath = this.getAttribute('svg-path');
        const icon = this.shadowRoot.querySelector('.card-icon');
        icon.src = svgPath;

        
        const header = this.shadowRoot.querySelector('.card-header');
        header.textContent = this.getAttribute('header');

        const body = this.shadowRoot.querySelector('#card-body');
        body.textContent = this.getAttribute('body');
       
    }
    
    static get observedAttributes() {
        return ['username', 'profile-pic', 'svg-path'];
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
			background-color: #18d39e;
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

