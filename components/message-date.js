

export class messageDate extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({mode:'open'});
        this.container = document.createElement('div')
        this.container.innerHTML = this.html()
		this.shadowRoot.appendChild(this.container);

	}

	addMessage(date) {
		const body = this.shadowRoot.querySelector(".date")
		if (body)
			body.textContent = date
	}

	connectedCallback() {
	}

	disconnectedCallback() {
    }

	html() {
		return (
			/*html*/
			`
				<style>
					@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');

					.date-container {
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						gap: 8px;
					}
					#left , .right{
						flex-grow: 1;
					}
					.date {
						font-size: 14px;
					}
				</style>

				<div class="date-container">
					<div id="left"> <hr> </div>
					<div class="date"> November 15, 2024 </div>
					<div class="right"> <hr> </div>
				</div>
			`
		)
	}
}