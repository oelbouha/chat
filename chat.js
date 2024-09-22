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
        <div id="convo-messages" class="p-3">
			<h4 class="mb-3"> Conversation</h4>
		</div>
        <div id="user-profile" class="p-3">
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
        
        if (this.activeMember) {
            this.activeMember.deactivate();
        }

        const mem = event.target;
        mem.activate();
        this.activeMember = mem;

        console.log(`Activated chat with ${username}`);
    }

    connectedCallback() {
        this.render();
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
            align-items: center;
            padding: 10px;
            border-radius: 8px;
            transition: background-color 0.2s ease;
            cursor: pointer;
        }
        .member:hover, .member.active {
            background-color: #e9ecef;
        }
        .avatar {
            width: 50px;
            height: 50px;
            margin-right: 15px;
			background-color: brown;
			border-radius: 50%;

        }
        #profile-pic {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .user-info {
            flex-grow: 1;
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
        <div class="avatar">
            <img id="profile-pic" src="/api/placeholder/50/50" alt="profile picture" class="img-fluid">
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

		this.dispatchEvent(new CustomEvent('memberClicked', {
			bubbles: true,
			composed: true,
			detail: { username }
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
		const profilePicElement = this.shadowRoot.querySelector('#profile-pic');
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



class conversation extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
	}

	connectedCallback() {
		this.render();
	}

	render() {
		const wrapper = document.createElement('div');
		wrapper.setAttribute('class', 'conversation-container');
		wrapper.textContent = "conversation";

		const style = document.createElement('style');

		style.textContent = `
			.conversation-container {
				width : 300px;
				height: 900px;

				border: 1px solid black;
			}
		`;

		this.shadowRoot.appendChild(wrapper);
		this.shadowRoot.appendChild(style);
	}

}


customElements.define("wp-chat", Chat);
customElements.define("wp-chat-member", chatMember);

