

export class gameRequest extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({mode:'open'});
        this.container = document.createElement('div')
        this.container.innerHTML = this.html()
		this.shadowRoot.appendChild(this.container);

		this.messageData = {
            "status": "",
            "time" : "",
            "type": "",
		}
	}
	connectedCallback() {
	}
	addMessage(message, type="user") {
		if (!message) return 
		if (message.status) this.messageData.status = message.status
		if (message.time) this.messageData.time = message.time
		this.messageData.type = type
		this.render()
	}

	getMessageStatusIcon(sts) {
        const status = sts.toLowerCase()
        if (['sn', 'seen'].includes(status)) return "assets/read.svg";
        else if (['recv', 'recieved'].includes(status)) return "assets/delivered.svg";
        else if (['st'].includes(status)) return "assets/send-to-server.svg";
        return "assets/not-send.svg"
    }

    updateMessage(message) {
        if (message.status) this.messageData.status = message.status
        this.render()
    }
    
    render() {
        const messageSts = this.shadowRoot.querySelector('.message-status-icon');
        const imageTag = this.shadowRoot.querySelector('#image-src');
        const userElement = this.shadowRoot.querySelector('.user-message');
        const userMessageTime = this.shadowRoot.querySelector('.message-time');

        if (this.messageData.time) {
            userMessageTime.textContent = this.messageData.time;
        }

        if (this.messageData.status) {
            messageSts.src = this.getMessageStatusIcon(this.messageData.status)
        }

        if (this.messageData.type == "client") {
            const msg = this.shadowRoot.querySelector('.user-message')
            msg.style["align-items"] = "flex-start"
            
            this.shadowRoot.querySelector('#invite-game-container').style["background-color"] = " #022f40"
            messageSts.style.display = "none"
        }
    }


	html() {
		return (
		/*html*/
		`
			<style>
				@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');

				:host {
					width: 100%;
					height: 100%;
				}
				.user-message {
					align-items: flex-end;
				}
				.message {
					color: #fff;
					display: flex;
					flex-direction: column;
					margin-bottom: 4px;
				}
				.invite-message-image-container {
					width: 50px;
					height: 50px;
				}
				#invite-game-container {
					background: #005c4b;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					font-style: oblique;
					font-size: 18px;
					max-width: 80%;
					border-radius: 7.5px;
					box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
					gap: 16px;
				}
				#icon-image {
					width:  50px;
					box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
				}

				#msg-status-container {
					display: flex;
					align-self: flex-end;
					flex-direction: row;
					justify-content: end;
					gap: 2px;
				}

				.message-status-icon {
					width:  15px;
					height: 15px;
				}
				.message-time {
					align-self: flex-end;
					font-size: 12px;
					color: #cdd3d7;
				}

			</style>
			<div class="message user-message">
				<div id="invite-game-container" class="p-2">
					<div class="invite-message-image-container">
						<img id="icon-image" src="assets/game-icon.svg" />
					</div>
					<div class="invite-message">Game Request</div>
					<div id="msg-status-container" >
						<div class="message-time">10:30AM</div>
						<div class="message-status">
							<img class="message-status-icon" src="" />
						</div>
					</div>
				</div>
			</div>
			`
		)
	}
}