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

        .user-video-container {
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            border-radius: 7.5px;
        }

        #video-tag {
            border-radius: 7.5px;
            object-fit: contain;
            background: #000; /* Optional: for letterboxing */
        }

        .msg-container {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: end;
            gap: 10px;
            background-color: #022f40;
            border-radius: 7.5px;
            padding: 3px 4px 3px 4px;
            box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
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
		
	</style>
    <div class="message user-message">
        <div class="msg-container">
            <div class="user-video-container">
                <video controls id="video-tag">
                    <source id="video-src" src="" type="">
                    browser does not support the video tag.
                </video>
            </div>
        </div>
        <div id="msg-status-container">
            <div class="message-time"></div>
            <div class="message-status">
                <img class="message-status-icon" src="assets/not-send.svg" />
            </div>
        </div>
    </div>
`;

export class userVideo extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode:'open'});
        this.shadowRoot.appendChild(userMessageTemplate.content.cloneNode(true));
	}

    connectedCallback() {

    }  

    addMessage(videosrc, time, status) {
        const userMessage = this.shadowRoot.querySelector('#video-src');
        userMessage.src = videosrc;

        const videoTag = this.shadowRoot.querySelector('#video-tag')
        videoTag.load()


        const videoContainer = this.shadowRoot.querySelector('.user-video-container')
        videoTag.addEventListener('loadedmetadata', () => {
            const naturalWidth = videoTag.videoWidth;
            const naturalHeight = videoTag.videoHeight;

            const maxVideoWidth = 350
            const maxVideoHeight = 350;

            if (naturalWidth > maxVideoWidth || naturalHeight > maxVideoHeight) {
                const widthScale = maxVideoWidth / naturalWidth
                const heightScale = maxVideoHeight / naturalHeight

                const scale = Math.min(widthScale, heightScale)

                
                const displayedWidth = Math.floor(naturalWidth * scale)
                const displayedheight = Math.floor(naturalHeight * scale)

                videoTag.style.width = `${displayedWidth}px`
                videoTag.style.height = `${displayedheight}px`
                
                videoContainer.style["width"] = `${displayedWidth}px`
                videoContainer.style["height"] = `${displayedheight}px`
            }
        })
        
    const userMessageTime = this.shadowRoot.querySelector('.message-time');
    userMessageTime.textContent = time;
    this.updateMessageStatus(status)
    const userElement = this.shadowRoot.querySelector('.user-message');
    userElement.style.display = 'flex';
    }
    
    updateMessageStatus(status) {
        const messageSts = this.shadowRoot.querySelector('.message-status-icon');
        if (status == "sn" || status == "seen") 
            messageSts.src = "assets/read.svg";
        else if (status == "recv" || status =="recieved") 
            messageSts.src = "assets/delivered.svg";
        else if (status == "st" || status == "ST") 
            messageSts.src = "assets/send-to-server.svg";
    }

    static getAttribute() {
        return ["user"];
    }
}