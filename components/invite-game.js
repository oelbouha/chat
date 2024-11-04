

export class inviteGame extends HTMLElement {
	constructor() {
		super()

		this.attachShadow({mode:'open'});
        this.container = document.createElement('div')
        this.container.innerHTML = this.html()
		this.shadowRoot.appendChild(this.container);

	}
	connectedCallback() {
		this.addEventListeners()
	}
	disconnectedCallback() {
		this.removeEventListeners()
	}
	addEventListeners() {
		const acceptBtn = this.shadowRoot.querySelector("#accept-btn")
		acceptBtn.addEventListener('click', () => {
			console.log("accept clicked")
		})
		const refuseBtn = this.shadowRoot.querySelector("#refuse-btn")
		refuseBtn.addEventListener('click', () => {
			console.log("refuse clicked")
		})
	}
	removeEventListeners() {
		const acceptBtn = this.shadowRoot.querySelector("#accept-btn")
		acceptBtn.removeEventListener('click', () => {
		})
		
		const refuseBtn = this.shadowRoot.querySelector("#refuse-btn")
		refuseBtn.removeEventListener('click', () => {
		})
	}
	gameRequestHtml() {
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
					min-width: 80px;
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
			<div class="message user-message p-4">
				<div id="invite-game-container" class="p-2">
					<div class="invite-message-image-container">
						<img id="icon-image" src="assets/game.svg" />
					</div>
					<div class="invite-message">game Request</div>
					<div id="msg-status-container" >
						<div class="message-time">10:30AM</div>
						<div class="message-status">
							<img class="message-status-icon" src="assets/read.svg" />
						</div>
					</div>
				</div>
			</div>
			`
		)
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
			.invite-icon-container {
				display: flex;
				justify-content: center;
			}
			#invite-game-container {
				background: #005c4b;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-style: oblique;
  				font-size: 18px;
				max-width: 80%;
				border-radius: 7.5px;
				box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
			}
			#remote-game-icon, #game-icon {
				width:  50px;
				box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
			}

			#msg-status-container {
				display: flex;
				align-self: flex-end;
				flex-direction: row;
				justify-content: end;
				gap: 2px;
				min-width: 80px;
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
			.btn-container, .invite-message-container {
				display: flex;
				flex-direction: column;
				gap: 8px;
			}
			.btn-container {
				display: flex;
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
				display: none;
				flex-direction: column;
				justify-content: center;
				align-items: center;
			}

		</style>
			<div class="message user-message p-4">
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
							waiting
							<img id="spinner-icon" src="assets/spinner.svg"/>
						</div>
					</div>
					
					<div id="msg-status-container" >
						<div class="message-time">10:30AM</div>
						<div class="message-status">
							<img class="message-status-icon" src="assets/read.svg" />
						</div>
					</div>
				</div>
			</div>
		`
		)
	}
}