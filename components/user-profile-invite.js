

export class userProfileInvite extends HTMLElement {
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
		this.addEventListeners()
	}
	disconnectedCallback() {
		this.removeEventListeners()
	}
	addEventListeners() {
		const acceptBtn = this.shadowRoot.querySelector("#accept-btn")
		if (acceptBtn) {	
			acceptBtn.addEventListener('click', () => {
				console.log("accept clicked")
			})
		}
		const refuseBtn = this.shadowRoot.querySelector("#refuse-btn")
		if (refuseBtn) {
			refuseBtn.addEventListener('click', () => {
				console.log("refuse clicked")
			})
		}
	}
	removeEventListeners() {
		const acceptBtn = this.shadowRoot.querySelector("#accept-btn")
		if (acceptBtn) {
			acceptBtn.removeEventListener('click', () => {
			})
		}
		
		const refuseBtn = this.shadowRoot.querySelector("#refuse-btn")
		if (refuseBtn) {
			refuseBtn.removeEventListener('click', () => {
			})
		}
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
        const messageTime = this.shadowRoot.querySelector('.message-time');


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
			.invite-icon-container {
				display: flex;
				justify-content: center;
			}
			#invite-game-container {
				color: white;
				background: #022f40;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-style: oblique;
  				font-size: 18px;
				width: 100%;
				border-radius: 7.5px;
				box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
			}
			#remote-game-icon, #game-icon {
				width:  50px;
				box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
			}

			.btn-container, .invite-message-container {
				display: flex;
				flex-direction: column;
				gap: 8px;
			}
			.btn-container {
				display: none;
				justify-content: center;
				align-items: center;
			}
			.invite-container {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				gap: 10px;
			}
			
			#icon, #spinner-icon {
				width:  25px;
				height: 25px;
			}

			.spinner-container {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
			}

		</style>
				<div id="invite-game-container" class="p-2">
					<div class="invite-container">
						<div class="invite-message-container">
							<div class="invite-message">game Invitation
							</div>
							<div class="invite-icon-container">
								<img id="game-icon" src="assets/ping-pong.svg" />
							</div>
						</div>
						<div class="btn-container">
							<button id="accept-btn" class="btn btn-success"> Accept </button>
							<button id="refuse-btn" class="btn btn-danger"> Refuse </button>
						</div>
						<div class="spinner-container">
							waiting for approval
							<img id="spinner-icon" src="assets/spinner.svg"/>
						</div>
					</div>
					
				</div>
		`
		)
	}
}