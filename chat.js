

const margin = "30px";
const margin_left = "30px";

const membersBorderRadius = "10px";

const template = document.createElement('template');

template.innerHTML = /*html*/`
	<style>
		:host {
			display: block;
			padding: 30px;
			height: 100%;
			background-color: #f1f0e8;
			box-sizing: border-box;
		}

		#chat-container {
			height: 100%;
			display: flex;
		}

		#convo-messages {
			width: 100%;
			margin-left: ${margin_left};
			height: 100%;
			background-color: #f5f4f1;
			box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
			border-radius: 24px;
		}
		
		#convo-list {
			display: flex;
			flex-direction: column;
			box-sizing: border-box;
			align-items: center;
			width: 30em;
			height: 100%;
			background-color: #f5f4f1;
			box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
			border-radius: 24px;
			overflow: hidden;
		}
		
		#user-profile {
			width: 30em;
			margin-left: ${margin_left};
			height: 100%;
			background-color: #f5f4f1;
			box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
			border-radius: 24px;
		}

		#convo-search {
			background-color: #282c34;
			border: none;
			width: 90%;
			color: white;
			border-radius: ${membersBorderRadius};
			padding: 1em;
		}

		.members_container {
			display: flex;
			flex-direction: column;
			align-items: center;
			box-sizing: border-box;
			width: 100%;
			overflow-y: auto;
		}

		p {
			font-size: 2.5em;
			margin-top: 10px;
			margin-bottom: 10px;
			font-weight: bold;
			color: #282c34;
		}

	</style>
	<div id="chat-container" >
		<div id="convo-list">
			<p>Chats</p>
			<input type="Search" id="convo-search" placeholder="Search users"> 
		</div>
		<div id="convo-messages"></div>
		<div id="user-profile"></div>
	</div>
`;

class chat extends HTMLElement {
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
		
		// console.log("clicked on a member chat");

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

		const convoList = this.shadowRoot.querySelector('#convo-list');

		const membersContainer = document.createElement('div');
		membersContainer.setAttribute('class', 'members_container');


		// setup the users
		convoList.appendChild(membersContainer);
			this.convo_list_users.forEach(userNmae => {
				const memberElement = document.createElement('wp-chat-member');
				memberElement.setAttribute('username', userNmae);
				memberElement.setAttribute('profile-pic', `person.png`);
				memberElement.setAttribute('last-message', 'hello there!');
				memberElement.addEventListener('memberClicked', this.handleMemberClick.bind(this));
				membersContainer.appendChild(memberElement);
		})
		convoList.appendChild(membersContainer);
	}
}

const chatMemberTemplate = document.createElement('template');

chatMemberTemplate.innerHTML = /*html*/ `
	<style>
		:host {
			display: block;
			width: 90%;
			box-sizing: border-box;
		}
		.member {
			display: flex;
			align-items: center;
			margin-top: 8px;
			width: 100%;
			color: white;
			border-radius: ${membersBorderRadius};
			background-color: #e1dfce;
			box-sizing: border-box;
			padding: 0.4em;
			transition: background-color 0.2s ease;
      		cursor: pointer;
		}
		.member:hover {
			background-color: #d0c98e;
		}

		.member.active {
			background-color: #d0c98e;
		}
		.avatar {
			width: 50px;
			height: 50px;
			margin-right: 1em;
			border: 1px solid #282c34;
			border-radius: 50%;
			overflow: hidden;
		}

		#profile-pic {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		.user-info {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex-grow: 1;
		}

		.username {
			font-weight: bold;
			color: #282c34;
			margin-bottom: 2px;
		}

		.last-message {
			font-size: 0.8em;
			color: #a0a0a0;
		}

	</style>

	<div class="member">
		<div class="avatar">
			<img id="profile-pic" src="/api/placeholder/40/40" alt="profile picture">
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


customElements.define("wp-chat", chat);
customElements.define("wp-chat-member", chatMember);

