
const userMessageTemplate = document.createElement('template');

userMessageTemplate.innerHTML = /*html*/ `
	<style>
		 @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
         
		:host {
            width: 100%;
            height: 100%;
        }

         .message {
            display: flex;
            flex-direction: column;
            margin-bottom: 4px;
        }
        
        #modal-container {
            display: none;
            position: fixed;
            inset: 0; /* Shorthand for top: 0; right: 0; bottom: 0; left: 0; */
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 9999;
            justify-content: center;
            padding: 20px;
        }

        #close-btn {
            position: fixed;
            top: 1%;
            right: 1%;
        }

        .message-content {
            max-width: 100%;
            padding: 10px 15px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
        }

        #msg-status-container {
            gap: 4px;
            display: flex;
            flex-direction: row;
            align-items: center;
            box-sizing: border-box;
            min-width: 70px;
        }

        .message-status-icon {
            width:  15px;
            height: 15px;
        }

        .msg-container {
            display: flex;
            flex-direction: column;
            align-items: end;
            background-color: #022f40;
            border-radius: 7.5px;
            padding: 3px 4px 3px 4px;
            box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
            border-bottom-right-radius: 2px;
            cursor: pointer;
        }

        .user-message {
            align-items: flex-end;
        }

        .message-time {
            align-self: flex-end;
            font-size: 12px;
            color: #888;
            min-width: 50px;
        }
        #image-container {
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            border-radius: 7.5px;
        }

		#image-src {
            display: none;
            border-radius: 7.5px;
            width: auto;
            height: auto;
            object-fit: contain;
		}
		
        #image-modal {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #img-modal-src {
            max-width: 90dvw;
            max-height: 90dvh;
        }

        .spinner-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 150px;
            width: 150px;
            transition: all 0.3s ease;
            background: linear-gradient(135deg, #03387d, #7dceac);
        }
        .spinner {
            width: 50px;
            height: 50px;
        }

	</style>
	<div class="message user-message position-relative">
        <div class="msg-container " >
            <div class="image-container">
				<img id="image-src" src="" />
			</div>
            <div class="spinner-container">
                <svg class="spinner"  xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g stroke="white"><circle cx="12" cy="12" r="9.5" fill="none" stroke-linecap="round" stroke-width="3"><animate attributeName="stroke-dasharray" calcMode="spline" dur="1.5s" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite" values="0 150;42 150;42 150;42 150"/><animate attributeName="stroke-dashoffset" calcMode="spline" dur="1.5s" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite" values="0;-16;-59;-59"/></circle><animateTransform attributeName="transform" dur="2s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></g></svg>
            </div>
        </div>
        <div id="msg-status-container" >
            <div class="message-time"></div>
            <div class="message-status">
                <img class="message-status-icon" src="assets/not-send.svg" />
            </div>
        </div>
    </div>

    <div id="modal-container">
        <div id="image-modal">
            <button id="close-btn" type="button" class="btn-close btn-close-white" aria-label="Close"></button>
            <img id="img-modal-src" src="" />
        </div>
    </div>
`;

export class imageMessage extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode:'open'});
        this.shadowRoot.appendChild(userMessageTemplate.content.cloneNode(true));

        this.imagedata = {
            "file": "",
            "prev_file": "",
            "status": "",
            "time" : "",
            "type": "",
            dimensions: {width: 0, height: 0}
        }
        this.setupEventListner()
	}

    connectedCallback() {
        const imageTag = this.shadowRoot.querySelector('#image-src');
        // imageTag.addEventListener('load', this.handleImageLoad.bind(this))
    }  

    setupEventListner() {
        const iamgeContainer = this.shadowRoot.querySelector(".image-container")
        const modal = this.shadowRoot.querySelector("#modal-container")

        const image = this.shadowRoot.querySelector("#img-modal-src")

        iamgeContainer.addEventListener('click', (e) => {
            modal.style.display = "flex"
            image.src = "http://127.0.0.1:8000" + this.imagedata.file
        })

        const closeBtn = this.shadowRoot.querySelector("#close-btn")
        closeBtn.addEventListener('click', () => {
            modal.style.display = "none"
        })
    }

    handleImageLoad() {
        const imageContainer = this.shadowRoot.querySelector('.image-container')
        const imageTag = this.shadowRoot.querySelector('#image-src');

        const naturalWidth = imageTag.naturalWidth;
        const naturalHeight = imageTag.naturalHeight;

        this.imagedata.dimensions = this.calculateImageDimensions(naturalWidth, naturalHeight)

        const spinner = this.shadowRoot.querySelector('.spinner-container')

        spinner.style.width = `${this.imagedata.dimensions.width}px`
        spinner.style.height = `${this.imagedata.dimensions.height}px`
        
        imageTag.style.width = `${this.imagedata.dimensions.width}px`
        imageTag.style.height = `${this.imagedata.dimensions.height}px`

        setTimeout(() => {
            spinner.style.display = "none"
            imageTag.style.display = "block"
        }, 300)
    }

    addMessage(image, time, status, type="user") {
        this.imagedata.file = image.f
        this.imagedata.prev_file = image.prev_f
        this.imagedata.time = time
        this.imagedata.type = type
        this.imagedata.status = status
        
        this.render()
    }

    calculateImageDimensions(naturalWidth, naturalHeight) {
        const maxWidth = 350;
        const maxHeight = 350;
        
        if (naturalWidth > maxWidth || naturalHeight > maxHeight) {
            const widthScale = maxWidth / naturalWidth;
            const heightScale = maxHeight / naturalHeight;
            const scale = Math.min(widthScale, heightScale);
            
            return {
                width: Math.floor(naturalWidth * scale),
                height: Math.floor(naturalHeight * scale)
            };
        }
        
        return {
            width: naturalWidth,
            height: naturalHeight
        };
    }

    disconnectedCallback() {
        const imageTag = this.shadowRoot.querySelector('#image-src');
        imageTag.removeEventListener('load', this.handleImageLoad)

        const modal = this.shadowRoot.querySelector("#modal-container")
        modal.removeEventListener('click', () => {})
    }

    getMessageStatusIcon(sts) {
        const status = sts.toLowerCase()
        if (['sn', 'seen'].includes(status)) return "assets/read.svg";
        else if (['recv', 'recieved'].includes(status)) return "assets/delivered.svg";
        else if (['st'].includes(status)) return "assets/send-to-server.svg";
        return "assets/not-send.svg"
    }

    updateMessage(message=null, time=null, status=null) {
        if (message) this.imagedata.file = message.f
        if (message) this.imagedata.prev_file = message.prev_f
        if (time) this.imagedata.time = time
        if (status) this.imagedata.status = status
        this.render()
    }
    
    render() {
        const messageSts = this.shadowRoot.querySelector('.message-status-icon');
        const imageTag = this.shadowRoot.querySelector('#image-src');
        const userElement = this.shadowRoot.querySelector('.user-message');
        const userMessageTime = this.shadowRoot.querySelector('.message-time');
        
        if (this.imagedata.prev_file) {
            const img = new Image()
            img.src = "http://127.0.0.1:8000" + this.imagedata.prev_file
            
            img.onload = () => {
                imageTag.src = "http://127.0.0.1:8000" + this.imagedata.prev_file
                this.imagedata.dimensions = this.calculateImageDimensions(img.width, img.height)

                const spinner = this.shadowRoot.querySelector('.spinner')
                const spinnerContainer = this.shadowRoot.querySelector('.spinner-container')

                spinnerContainer.style.width = `${this.imagedata.dimensions.width}px`
                spinnerContainer.style.height = `${this.imagedata.dimensions.height}px`
                
                imageTag.style.width = `${this.imagedata.dimensions.width}px`
                imageTag.style.height = `${this.imagedata.dimensions.height}px`
                
                setTimeout(() => {
                    imageTag.style.display = "block"
                    spinner.style.display = "none"
                    spinnerContainer.style.display = "none"
                }, 300)
            }
        }

        if (this.imagedata.time) {
            userMessageTime.textContent = this.imagedata.time;
        }

        if (this.imagedata.status) {
            messageSts.src = this.getMessageStatusIcon(this.imagedata.status)
        }

        if (this.imagedata.type == "client") {
            const msg = this.shadowRoot.querySelector('.user-message')
            msg.style["align-items"] = "flex-start"
            
            this.shadowRoot.querySelector('.msg-container').style["background-color"] = " #022f40"
            messageSts.style.display = "none"
        }
    }

    static getAttribute() {
        return ["user"];
    }
}