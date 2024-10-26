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
        
        .message-content {
            max-width: 100%;
            padding: 10px 15px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
        }

        #msg-status-container {
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
            background-color: red;
            background-color: #022f40;
            border-radius: 7.5px;
            padding: 3px 4px 3px 4px;
            box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
            border-bottom-left-radius: 2px;
            cursor: pointer;
        }

        .client-message {
            align-items: flex-start;
            display: none;
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
            border-radius: 7.5px;
            width: auto;
            height: auto;
            object-fit: contain;
            max-width: 350px;
            max-height: 240px;
		}

        #modal-container {
            display: none;
            position: fixed;
            inset: 0; /* Shorthand for top: 0; right: 0; bottom: 0; left: 0; */
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 9999;
            justify-content: center;
            align-items: center;
        }

        #close-btn {
            position: fixed;
            top: 1%;
            right: 1%;
        }
		
	</style>
	<div class="message client-message position-relative">
        <div class="msg-container " >
            <div class="image-container">
				<img id="image-src" src="" />
			</div>
        </div>
        <div id="msg-status-container" >
            <div class="message-time"></div>
        </div>
    </div>

    <div id="modal-container">
        <div id="image-modal">
            <button id="close-btn" type="button" class="btn-close btn-close-white" aria-label="Close"></button>
            <img id="img-modal-src" src="" />
        </div>
    </div>
`;

export class clientImage extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode:'open'});
        this.shadowRoot.appendChild(userMessageTemplate.content.cloneNode(true));

        this.imageFile = null
        this.imagePreviewFile = null
        this.setupEventListner()
	}

    setupEventListner() {
        const iamgeContainer = this.shadowRoot.querySelector(".image-container")
        const modal = this.shadowRoot.querySelector("#modal-container")

        const image = this.shadowRoot.querySelector("#img-modal-src")

        iamgeContainer.addEventListener('click', (e) => {
            modal.style.display = "flex"
            image.src = "http://127.0.0.1:8000" + this.imagefile
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

        const maxWidth = 350
        const maxHeight = 350;

        if (naturalWidth > maxWidth || naturalHeight > maxHeight) {
            const widthScale = maxWidth / naturalWidth
            const heightScale = maxHeight / naturalHeight

            const scale = Math.min(widthScale, heightScale)

            const displayedWidth = naturalWidth * scale
            const displayedheight = naturalHeight * scale

            imageTag.style["width"] = `${displayedWidth}px`
            imageTag.style["height"] = `${displayedheight}px`
        }
    }

    connectedCallback() {
        const imageTag = this.shadowRoot.querySelector('#image-src');
        imageTag.addEventListener('load', this.handleImageLoad.bind(this))
    }  

    addMessage(image, time) {
        const imageFile = image.f
        const imagePrevFile = image.prev_f
        
        const imageTag = this.shadowRoot.querySelector('#image-src');
        imageTag.src = "http://127.0.0.1:8000" + imageFile

        this.imagePreviewFile = imagePrevFile
        this.imagefile = imageFile
        
        const userMessageTime = this.shadowRoot.querySelector('.message-time');
        userMessageTime.textContent = time;

        const userElement = this.shadowRoot.querySelector('.client-message');
        userElement.style.display = 'flex';
    }

    disconnectedCallback() {
        const imageTag = this.shadowRoot.querySelector('#image-src');
        imageTag.removeEventListener('load', this.handleImageLoad)

        const modal = this.shadowRoot.querySelector("#modal-container")
        modal.removeEventListener('click', () => {})
    }

    static getAttribute() {
        return ["user"];
    }
}