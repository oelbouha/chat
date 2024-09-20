

const margin = "30px";
const margin_left = "30px";

const template = document.createElement('template');

template.innerHTML = /*html*/`
	<style>
		:host * {
			box-sizing: border-box;
		}
		:host {
			display: block;
			padding: 30px;
			height: 100%;
			background-color: #f1f0e8;
			box-sizing: border-box;
		}
		#chat-design {
			height: 100%;
			display: flex;
		}

		#convo-messages {
			width: calc(80% - 30px);
			margin-left: ${margin_left};
			height: 100%;
			background-color: #f5f4f1;
			box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
			border-radius: 24px;
		}
		
		#convo-list {
			width: 30em;
			height: 100%;
			background-color: #f5f4f1;
			box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
			border-radius: 24px;
		}
		
		#user-profile {
			width: 30em;
			margin-left: ${margin_left};
			height: 100%;
			background-color: #f5f4f1;
			box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
			border-radius: 24px;
		}

	</style>
	<div id="chat-design">
		<div id="convo-list">
			<p>members</p>
		</div>
		<div id="convo-messages">
			<p>conversation </p>
		</div>
		<div id="user-profile">
			<p>user profile </p>
		</div>
	</div>
`;

class chat extends HTMLElement {
	constructor() {
		super();
		
		const shadowRoot = this.attachShadow({mode:'open'});
		let templateClone = template.content.cloneNode(true);
		shadowRoot.append(templateClone);		

		this.convo_list_users = ['bob', 'mohamed', 'ahmed', 'zohair', 'reda', 'amal', 'othman', 'ysf', 'khalid'];
	}

	connectedCallback() {
		this.render();
	}

	render() {

		const convo_list_container = document.createElement('div');
		convo_list_container.setAttribute('class', 'convo-list-container');


		// const convo_messages_container = document.createElement('div');
		// convo_messages_container.setAttribute('class', 'convo-messages-container');

		convo_list_container.textContent = "";
		
		const membersContainer = document.createElement('div');
		membersContainer.setAttribute('class', 'members-container');

		// setup the users
		convo_list_container.appendChild(membersContainer);
			this.convo_list_users.forEach(userNmae => {
				const memberElement = document.createElement('wp-chat-member');
				memberElement.setAttribute('name', userNmae);
				membersContainer.appendChild(memberElement);
		})
	}
}


class chatMember extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode:'open'});
	}

	connectedCallback() {
		this.render();
	}
	
	render() {
		const wrapper = document.createElement('div');
		wrapper.setAttribute('class', 'member');
		wrapper.textContent = "member";


		const style = document.createElement('style');

		style.textContent = `
			.member {
				height: 50px;
				color: white;
				padding: 15px;
				width: 350px;
				border-radius: 24px;
				background-color: #282c34;
			}
		`;
		
		this.shadowRoot.appendChild(wrapper);
		this.shadowRoot.appendChild(style);
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

