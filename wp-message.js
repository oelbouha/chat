
const template = document.createElement('template');

template.innerHTML = /*html*/ `
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
        this.shadowRoot.appendChild(template.content.cloneNode(true));
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


customElements.define("wp-message", Message);