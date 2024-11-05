import { websocket } from "./net.js";
import { getData, formatTime, getCurrentTime, replaceChar } from "./net.js"
import { getVideoThumbnail } from "../video_thumbnail.js"

let typingTimer;
const doneTypingInterval = 2000;
let typingTime;


function getTimestamp(format = 'ms') {
    const now = Date.now(); // Gets current timestamp in milliseconds
    
    const formats = {
        ms: now,                    // Full milliseconds
        seconds: Math.floor(now / 1000),  // Convert to seconds
        formatted: {
            milliseconds: now % 1000,           // Just milliseconds part (0-999)
            seconds: Math.floor((now / 1000) % 60),    // Just seconds part (0-59)
            minutes: Math.floor((now / 1000 / 60) % 60), // Just minutes part (0-59)
            hours: Math.floor((now / 1000 / 60 / 60) % 24), // Just hours part (0-23)
        }
    };
    
    return formats[format] || formats.ms;
}

export class chat extends HTMLElement {
    constructor() {
        super();
        
        const shadowRoot = this.attachShadow({mode:'open'});
        this.container = document.createElement('div')
        this.container.innerHTML = this.html()
        shadowRoot.append(this.container);   

        this.convo_list_users = [
        {
            "userName": "jawad",
            "id": "2",
            "profilePic": "assets/after.png",
            "unreadMessagesCount": "",
            "lastMessage": ""
        }, 
        {
            "userName": "khalid",
            "id": "10",
            "profilePic": "assets/after.png",
            "unreadMessagesCount": "",
            "lastMessage": ""
        }, 
        ];

        this.activeMember = null;
        this.isActive = false;
        
        this.activeMemberId = null;
        this.activeMemberUsername = null;
        this.activeMemberstatus = null
        this.isSend = false

        this.username = "outman"
        this.userId = 1

        this.overlayActive = false
        this.offcanvasActive = false
        this.inviteDropDownActive = false;
        websocket.onmessage = (e) => {
            const message = JSON.parse(e.data);   
            if (message.m == "msg")
                this.handleIncomingMessage(message)
            else if (message.m == "st" || message.m == "sn" || message.m == "recv")
                this.handleMessageStatus(message)
            else if (message.m == "typ")
                this.handleTyping(message)
            else if (message.m == "styp")
                this.handleTyping(message)
        }
                
        this.identifier = 0
        this.clientsMessages = new Map()
        this.databaseMessages = new Map()
        
        this.render();
        this.updateUnreadMemberMessages()
    }

    updateScroll() {
        const element = this.shadowRoot.querySelector("#chat-conversation");

        // Scroll to bottom immediately after adding content
        element.scrollTop = element.scrollHeight;
        
        // Use MutationObserver to scroll when new content is added
        const observer = new MutationObserver(() => {
            setTimeout(() => {
                element.scrollTop = element.scrollHeight;
            }, 0);
        });
        
        observer.observe(element, { childList: true });
    }

    displayConvoHeader(event) {
        const profilePic = event.detail.profilePic;

        const userHeaderStatus = this.shadowRoot.querySelector(".convo-user-status")
        if (!userHeaderStatus) return 
        
        this.activeMemberstatus = "online"
        userHeaderStatus.textContent = this.activeMemberstatus
        userHeaderStatus.style["color"] = "green"
        
        const chatConversation = this.shadowRoot.querySelector('#convo-messages-container');
        // display header and message input 
        const convoHeader = chatConversation.querySelector('#user-header-container');
        convoHeader.style.display = 'block';
        const inputMessage = chatConversation.querySelector('#input-message-container');
        inputMessage.style.display = `flex`;
        
        // display user image and name
        const userProfileImg = convoHeader.querySelector('#user-image');
        userProfileImg.src = profilePic;
        const userName = convoHeader.querySelector('.convo-username');
        userName.textContent = this.activeMemberUsername;
    }
    
    displayClientProfile(event) {
        const profilePic = event.detail.profilePic;
        const userProfile = this.shadowRoot.querySelector('#user-profile');
        // if (userProfile.style.display != 'block')
            userProfile.style.display = 'flex';
        // userProfile.innerHTML = ``;

        const profileInfo = userProfile.querySelector(".profile-info")
        profileInfo.innerHTML = ``

        const profileComponent = document.createElement('wc-chat-profile');
        const data = {
            "name": this.activeMemberUsername,
            "profilePic": profilePic,
            "phoneNumber": "0639316995",
            "description": "this is description ..."
        }
        profileComponent.addUserInfo(data)

        profileInfo.appendChild(profileComponent);
    }

    async fetchData(userId, clientId) {
        let data = await getData(userId, clientId);
        if (!data) return
        this.databaseMessages.set(clientId, data)
        for (let message of data)
            this.storeMessage(clientId, message)
        // console.log(this.clientsMessages)
    }

    handleMemberClick(event) {
        const profilePic = event.detail.profilePic

        if (this.activeMember) {
            this.activeMember.deactivate();
        }

        const clickedMember = event.target
        clickedMember.activate();
        if (clickedMember === this.activeMember) return 

        this.activeMember = clickedMember

        this.activeMemberId = event.detail.id
        this.activeMemberUsername = event.detail.username

        // console.debug(`active member : ${this.activeMemberUsername}`)
        
        // display user heeader
        this.displayConvoHeader(event)
        
        // load member conversation
        this.renderActiveUserMessages()

        // /// load the profile info
        this.displayClientProfile(event)
      
        // close overlay
        this.handleOverlayClick();
    }

    handleUserSearch(event)  {
        const searchQuery = event.target.value.toLowerCase();
        const membersContainer = this.shadowRoot.querySelector('.members-container');
        const members = membersContainer.querySelectorAll('wc-chat-member');
    
        members.forEach(member => {
            const username = member.getAttribute('username').toLowerCase();
            if (username.includes(searchQuery)) {
                member.style.display = '';
            } else {
                member.style.display = 'none';
            }
        });
    }

    connectedCallback() {
        this.shadowRoot.addEventListener('memberClicked', this.handleMemberClick.bind(this));
        
        const mainSearch = this.shadowRoot.querySelector('#convo-search');
        mainSearch.addEventListener('input', this.handleUserSearch.bind(this));

        const profileIcon = this.shadowRoot.querySelector('.profile-icon');
        profileIcon.addEventListener('click', this.handleProfileOffCanvas.bind(this));

        this.addMessageEventListener()
        this.addOffcanvasEventListener()
        this.uploadFilesEventListner()


        const returnIcon = this.shadowRoot.querySelector(".return-icon")
        returnIcon.addEventListener('click', () => {
            this.showMembersDivElement()
        })

        window.addEventListener('resize', () => {
            if (window.innerWidth > 800 && this.overlayActive) {
                this.hideOverlay()
            }
            else if (this.offcanvasActive)
                this.showOverlay()
        })

        const inviteGame = this.shadowRoot.querySelector("#invite-game-icon")
        inviteGame.addEventListener('click', () => {
            console.log("clicked")
            const dropdown = this.shadowRoot.querySelector('.dropdown-content')
            if (this.inviteDropDownActive) {
                dropdown.style.display = "none"
                this.inviteDropDownActive = false
            }
            else {
                dropdown.style.display = "flex"
                this.inviteDropDownActive = true;
            }
        })
        const pingPongTag = this.shadowRoot.querySelector("#ping-pong")
        pingPongTag.addEventListener('click', ()=> {
            const dropdown = this.shadowRoot.querySelector('.dropdown-content')
            dropdown.style.display = "none"
            const message = {
                "m": "msg",
                "clt": "1",
                "cnt": "game request",
                "tp": "INVITE",
                "status": "sn",
                "time": "4:30AM"
            }
            this.displayUserMessage(message)

        })
    }

    async uploadImageFile(file) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('preview', file)
        
        try {
            const response = await fetch('http://127.0.0.1:8000/upload/', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) throw new Error('Upload failed');
            
            const result = await response.json();
            console.log(result)
            this.sendImageMessage(result)
            
        } catch (error) {
            console.error(error)
        }
    }
    async uploadVideoToServer(formData) {
        try {
            const response = await fetch('http://127.0.0.1:8000/upload/', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) throw new Error('Upload failed');
            
            const result = await response.json();
            this.sendVideoMessage(result)
            
        } catch (error) {
            console.error(error)
        }
    }

    sendVideoMessage(files) {
        const message = {
            "m": "msg",
            "clt": this.activeMemberId,
            "tp": "VD",
            "identifier": this.username + getTimestamp(),
            "cnt": JSON.stringify(files),
            "status": "pending",
            "time": getCurrentTime()
        }
        websocket.send(JSON.stringify(message));
        this.displayUserMessage(message)
        message["sender"] = this.userId
        message["recipient"] = this.activeMemberId
        this.storeMessage(this.activeMemberId, message)
    }

    sendImageMessage(imageFiles) {
        const message = {
            "m": "msg",
            "clt": this.activeMemberId,
            "tp": "IMG",
            "identifier": this.username + getTimestamp(),
            "cnt": JSON.stringify(imageFiles),
            "status": "pending",
            "time": getCurrentTime()
        }
        websocket.send(JSON.stringify(message));
        this.displayUserMessage(message)
        message["sender"] = this.userId
        message["recipient"] = this.activeMemberId
        this.storeMessage(this.activeMemberId, message)
    }

   async uploadFilesEventListner() {
        this.shadowRoot.querySelector('.add-file-icon').addEventListener('click' , () => {
            const fileInput = this.shadowRoot.querySelector('#files')
            fileInput.addEventListener('change', (event) => {
                const selectedFile = event.target.files[0]
                if (selectedFile) {
                    const fileType = selectedFile.type
                    if (fileType.startsWith('image/')) {
                        this.uploadImageFile(selectedFile)
                    }
                    else if (fileType.startsWith('video/')) {
                        this.handleVideoFile(selectedFile, selectedFile)
                    }
                }
                fileInput.value = ""
            })
        })

    }

    async handleVideoFile(videoFile) {
        const result = await getVideoThumbnail(videoFile, "output")
        
        const formdata = new FormData()
        formdata.append('file', videoFile)
        formdata.append('preview', result.file)
        this.uploadVideoToServer(formdata)
    }

    addOffcanvasEventListener() {
        const profileOffcanvasCloseBtn = this.shadowRoot.querySelector('#profileOffcanvasCloseBtn');
        if (profileOffcanvasCloseBtn)
            profileOffcanvasCloseBtn.addEventListener('click', this.handleProfileCloseOffcanvas.bind(this));
        
        const listOffcanvas = this.shadowRoot.querySelector('.list-icon');
        if (listOffcanvas)
            listOffcanvas.addEventListener('click', this.showMembersDivElement.bind(this));
    
        const overlay = this.shadowRoot.querySelector('#overlay');
        if (overlay)
            overlay.addEventListener('click', this.handleOverlayClick.bind(this));

    }

    addMessageEventListener() {
        const sendBtn = this.shadowRoot.querySelector('#send-btn-icon');
        sendBtn.addEventListener('click', this.sendMessage.bind(this));
        
        const inputMessage = this.shadowRoot.querySelector('#message-input');
        inputMessage.addEventListener('input', this.handleMessageSendbtn.bind(this));
        inputMessage.addEventListener('keypress', (e) => {
            if (e.key == "Enter")
                this.sendMessage(e);
        });
    }

    displayUserIsTyping(clientId) {
        if (!this.activeMember || this.activeMemberId != clientId) return 
        
        const userHeaderStatus = this.shadowRoot.querySelector(".convo-user-status")
        if (!userHeaderStatus) return 
        
        userHeaderStatus.textContent = "typing..."
        userHeaderStatus.style["color"] = "green"
    }
    
    hideIsTyping(clientId) {

        const userHeaderStatus = this.shadowRoot.querySelector(".convo-user-status")
        if (!userHeaderStatus) return

        if (userHeaderStatus.textContent == "typing...")
            userHeaderStatus.textContent = "online" // update it to the last status the user was
         
        // update the status of the user
        userHeaderStatus.textContent = "online"
        userHeaderStatus.style["color"] = "green"
    }

    handleTyping(message) {
        const membersContainer = this.shadowRoot.querySelector('.members-container');
        const memberElement = membersContainer.querySelector(`wc-chat-member[id="${message.clt}"]`);


        if (message.m == "typ"){
            clearTimeout(typingTime)
            memberElement.displayIsTyping()
            this.displayUserIsTyping(message.clt)
            
            typingTime = setTimeout(() => {
                memberElement.stopIsTyping()
                this.hideIsTyping(message.clt)
            }, doneTypingInterval)
        }
        else {
            memberElement.stopIsTyping()
            this.hideIsTyping(message.clt)
        }
    }

    displayIncomingMessage(message) {
        const conversation = this.shadowRoot.querySelector('#chat-conversation');
        if (!conversation) return

        if (message.tp == "TXT") {
            const textMessageComponent = document.createElement('wc-text-message')
            textMessageComponent.addMessage(message, "client")
            conversation.appendChild(textMessageComponent)
        }
        else if (message.tp == "IMG") {
            const imageMessageComponent = document.createElement('wc-image-message')
            imageMessageComponent.addMessage(message.cnt, message, "client")
            conversation.appendChild(imageMessageComponent)
        }
        else if (message.tp == "VD") {
            const videoComponent = document.createElement('wc-video-message')
            videoComponent.addMessage(message.cnt, message, "client")
            conversation.appendChild(videoComponent)
        }
    }

    handleIncomingMessage(message) {        
        message["sender"] = message.clt
        message["recipient"] = this.userId
        message["time"] =  getCurrentTime()

        this.storeMessage(message.clt, message)
        
        console.warn(`new message recieved  :  ${JSON.stringify(message)}`)
        
        this.markeAsRecieved(message)

        const usersContainer = this.shadowRoot.querySelector('.members-container');

        const recipient = this.convo_list_users.find(user => user.id == message.clt)
        if (!recipient) return 

        const recipientComponent = usersContainer.querySelector(`wc-chat-member[username="${recipient.userName}"]`);
        
        if (!this.activeMemberId || recipient.id != this.activeMember.id) {
            this.updateUnreadMessages(recipient, message)
            return 
        }
        this.displayIncomingMessage(message)
        this.activeMember.updateLastMessage(message)
        recipientComponent.hideMessageCounter()
        this.markeAsRead(message)
    }
    
    markeAsRead(message) {
        message["status"] = "sn"
        const response = {
            "m": "sn",
            "clt": message.sender,
            "msg": message.msg
        }
        websocket.send(JSON.stringify(response));    
    }

    markeAsRecieved(message) {
        message["status"] = "recv"
        const response = {
            "m": "recv",
            "clt": message.sender,
            "msg": message.msg
        }
        websocket.send(JSON.stringify(response));
    }

    storeMessage(key, message) {
        const numberKey = Number(key)
        const messages = this.clientsMessages.get(numberKey) || []
        messages.push(message)
        this.clientsMessages.set(numberKey, messages);
    }
    
    updateUnreadMessages(recipient, message) {
        const usersContainer = this.shadowRoot.querySelector('.members-container');
        const recipientComponent = usersContainer.querySelector(`wc-chat-member[username="${recipient.userName}"]`);

        recipientComponent.displayMessageCounter(1, message)
        recipientComponent.updateLastMessage(message)

        this.moveMemberElementToTop(recipient)
    }

    moveMemberElementToTop(targrtClient) {
        const membersContainer = this.shadowRoot.querySelector('.members-container');
        const memberElement = membersContainer.querySelector(`wc-chat-member[username="${targrtClient.userName}"]`);

        membersContainer.removeChild(memberElement)
        membersContainer.insertBefore(memberElement, membersContainer.firstChild)

        const userIndex = this.convo_list_users.findIndex(user => user.userName === targrtClient.userName);
        if (userIndex !== -1) {
            const user = this.convo_list_users.splice(userIndex, 1)[0];
            this.convo_list_users.unshift(user);
        }
    }

    getMessagesById(id) {
        for (const [key, val] of this.clientsMessages.entries()) {
            if (key == id) {
                return val
            }
        }
        return undefined;
    }

    handleMessageStatus(message) {
        const userId = message.clt
        const activeMemberMessages = this.getMessagesById(userId)
        if (!activeMemberMessages) {
            console.warn(`no messages found for user : ${userId}`)
            return
        }

        let messageToUpdate = activeMemberMessages.find(msg => msg.msg == message.msg)
        if (!messageToUpdate) {
            // console.warn(`couldn't find message  by id : ${JSON.stringify(message)}`)
            messageToUpdate = activeMemberMessages.find(msg => msg.identifier == message.identifier)
        }
        if (!messageToUpdate) {
            console.warn(`couldn't find the target message to update : ${JSON.stringify(message)} `)
            return
        }        
        messageToUpdate["status"] = message.m
        messageToUpdate["msg"] = message.msg

        const recipient = this.convo_list_users.find(user => user.id == message.clt)
        if (!recipient) {
            console.warn(`couldn't find the target user for this message : ${JSON.stringify(message)} `)
            return
        }
        // console.log("msg to update :: ", messageToUpdate.recipient == this.activeMemberId)

        if (messageToUpdate.recipient != this.activeMemberId) {
            const usersContainer = this.shadowRoot.querySelector('.members-container');
            const recipientComponent = usersContainer.querySelector(`wc-chat-member[username="${recipient.userName}"]`);
            recipientComponent.updateLastMessage(messageToUpdate)
            return // the conversation is not open so update last message and return
        }
       
        const conversation = this.shadowRoot.querySelector("#chat-conversation")
        const usersContainer = this.shadowRoot.querySelector('.members-container');
        const recipientComponent = usersContainer.querySelector(`wc-chat-member[username="${recipient.userName}"]`);
        recipientComponent.updateLastMessage(messageToUpdate)
        
        let messageComponent = null
        let identifierAttribute = null
        let idAttribute = null
        if (messageToUpdate.tp == "TXT") {
            identifierAttribute = `wc-text-message[message-id="${messageToUpdate.identifier}"]`
            idAttribute = `wc-text-message[message-id="${messageToUpdate.msg}"]`
        }
        else if (messageToUpdate.tp == "IMG") {
            identifierAttribute = `wc-image-message[message-id="${messageToUpdate.identifier}"]`
            idAttribute = `wc-image-message[message-id="${messageToUpdate.msg}"]`
        }
        else if (messageToUpdate.tp == "VD") {
            identifierAttribute = `wc-video-message[message-id="${messageToUpdate.identifier}"]`
            idAttribute = `wc-video-message[message-id="${messageToUpdate.msg}"]`
        }
        messageComponent = conversation.querySelector(`${identifierAttribute}`)
        if (!messageComponent)
            messageComponent = conversation.querySelector(`${idAttribute}`)
        if (messageComponent)
            messageComponent.updateMessage(messageToUpdate)
        this.updateScroll()
    }

    getUnreadMessagesCount(id) {
        const array = this.databaseMessages.get(id)
        if (!array) return 0
        let count = 0

        for (let i = array.length - 1; i >= 0; --i) {
            const item = array[i]
            if (item.sender == id) {
                if (this.isMessageSeen(item.status)) {
                    return count
                }
                if (!this.isMessageRecieved(item.status))
                    this.markeAsRecieved(item)
                count++;
            }
            else
                return count
        }
        return count;
    }

    renderTextMessage(message) {
        const conversation = this.shadowRoot.querySelector('#chat-conversation');
        if (!conversation) return 
        const messageComponent = document.createElement('wc-text-message')
        if (message.sender == this.activeMemberId) {
            messageComponent.addMessage(message, "client")
        }
        else {
            messageComponent.addMessage(message);
        }
        messageComponent.setAttribute("message-id",  message.identifier);
        if(message.msg)
            messageComponent.setAttribute("message-id",  message.msg);
        conversation.appendChild(messageComponent)
    }
    
    renderVideoMessage(message) {
        const conversation = this.shadowRoot.querySelector('#chat-conversation');
        if (!conversation) return
        
        const videoComponent = document.createElement('wc-video-message')
        let imageFiLes = message.cnt
        if (!imageFiLes.f)
            imageFiLes = JSON.parse(replaceChar(message.cnt, "'", '"'))

        if (message.sender == this.activeMemberId) {
            videoComponent.addMessage(imageFiLes, message, "client")
        }
        else {
            videoComponent.addMessage(imageFiLes, message)
        }
        videoComponent.setAttribute("message-id",  message.identifier);
        if(message.msg)
            videoComponent.setAttribute("message-id",  message.msg);

        conversation.appendChild(videoComponent)
    }
    renderImageMessage(message) {
        const conversation = this.shadowRoot.querySelector('#chat-conversation');
        if (!conversation) return
        
        const imageComponent = document.createElement('wc-image-message')
        let imageFiLes = message.cnt
        if (!imageFiLes.f)
            imageFiLes = JSON.parse(replaceChar(message.cnt, "'", '"'))

        if (message.sender == this.activeMemberId) {
            imageComponent.addMessage(imageFiLes, message, "client")
        }
        else {
            imageComponent.addMessage(imageFiLes, message)
        }
        imageComponent.setAttribute("message-id",  message.identifier);
        if(message.msg)
            imageComponent.setAttribute("message-id",  message.msg);
        conversation.appendChild(imageComponent)
    }

    isMessageSeen(status) {
        const messageStatus = status.toLowerCase()
        if (["sn", "seen"].includes(messageStatus))
            return true
        return false
    }
    isMessageRecieved(status) {
        const messageStatus = status.toLowerCase()
        if (["recv", "recieved"].includes(messageStatus))
            return true
        return false
    }

    renderClientMessages(messages) {
        if (!messages) return 
        
        const conversation = this.shadowRoot.querySelector('#chat-conversation');
        if (!conversation) return 
        
        messages.forEach(message => {
            if (message.tp == "TXT") {
                this.renderTextMessage(message)
            }
            else if (message.tp == "IMG") {
                this.renderImageMessage(message)
            }
            else if (message.tp == "VD") {
                this.renderVideoMessage(message)
            }
            if (message.sender == this.activeMemberId && !this.isMessageSeen(message.status)) {
                this.markeAsRead(message)
            }
    });
}
    renderActiveUserMessages() {

        const chatConversation = this.shadowRoot.querySelector("#convo-messages-container")
        const messagesBody = chatConversation.querySelector('#chat-conversation');
        messagesBody.innerHTML = ``
        
        let targetMemberMessages = this.getMessagesById(this.activeMemberId)
        if (!targetMemberMessages || targetMemberMessages.length == 0) {
            // console.warn(`no conversation messages found for user : ${this.activeMemberId}`)
            return 
        }

        // console.debug(`rendring  conversation for user : ${this.username} with ${this.activeMemberUsername}`)

        const membersContainer = this.shadowRoot.querySelector('.members-container');
        const targetMember = membersContainer.querySelector(`wc-chat-member[id="${this.activeMemberId}"]`)
        if (!targetMember) {
            console.warn(`target member Element not found : ${this.username}`)
            return 
        }

        targetMember.hideMessageCounter()

        const lastMessage = targetMemberMessages[targetMemberMessages.length - 1]
        this.renderClientMessages(targetMemberMessages)
        targetMember.updateLastMessage(lastMessage)
        this.updateScroll()
    }

    displayUserMessage(message) {
        const conversation = this.shadowRoot.querySelector('#chat-conversation');

        if (message.tp == "TXT") {
            const UserMessageComponent = document.createElement('wc-text-message');
            UserMessageComponent.addMessage(message);
            UserMessageComponent.setAttribute("message-id",  message.identifier);
            if (message.msg)
                UserMessageComponent.setAttribute("message-id",  message.msg);
            conversation.appendChild(UserMessageComponent);
        }
        else if (message.tp == "IMG") {
            const UserMessageComponent = document.createElement('wc-image-message');
            UserMessageComponent.addMessage(JSON.parse(message.cnt), message);
            UserMessageComponent.setAttribute("message-id",  message.identifier);
            if (message.msg)
                UserMessageComponent.setAttribute("message-id",  message.msg);
            conversation.appendChild(UserMessageComponent);
        }
        else if (message.tp == "VD") {
            const UserMessageComponent = document.createElement('wc-video-message');
            UserMessageComponent.addMessage(JSON.parse(message.cnt), message.time, message.status);
            UserMessageComponent.setAttribute("message-id",  message.identifier);
            if (message.msg)
                UserMessageComponent.setAttribute("message-id",  message.msg);
            conversation.appendChild(UserMessageComponent);
        }
        else if (message.tp == "INVITE") {
            const UserMessageComponent = document.createElement('wc-profile-invite');
            UserMessageComponent.addMessage(message);
            UserMessageComponent.setAttribute("message-id",  message.identifier);
            if (message.msg)
                UserMessageComponent.setAttribute("message-id",  message.msg);
            conversation.appendChild(UserMessageComponent);

            const userProfile = this.shadowRoot.querySelector("#user-profile")
            const inviteGame = userProfile.querySelector(".invite-game-container")
            inviteGame.innerHTML = ``
            inviteGame.style["align-items"] = "center;"
            inviteGame.appendChild(UserMessageComponent)
        }
        const usersContainer = this.shadowRoot.querySelector('.members-container');
        const userComponent = usersContainer.querySelector(`wc-chat-member[username="${this.activeMemberUsername}"]`);
        if (!userComponent) {
            console.warn(`can't find user component ${this.activeMemberUsername}`)
            return 
        }
        userComponent.updateLastMessage(message)
    }

    sendMessage(event) {
        const input = this.shadowRoot.querySelector('#message-input');

        const message = input.value;
        input.value = "";
        input.focus();

        if (message) {
            this.identifier = getTimestamp()
            const response = {
                "m": "msg",
                "clt": this.activeMemberId, // client id
                "tp": "TXT",
                "identifier": this.username + this.identifier,
                "cnt": message,
                "status": "pending",
                "time": getCurrentTime()
            }
            websocket.send(JSON.stringify(response));
            this.displayUserMessage(response)
            response["sender"] = this.userId
            response["recipient"] = this.activeMemberId
            this.storeMessage(this.activeMemberId, response)
            this.updateScroll();
        }
    }

    handleMessageSendbtn(event) {
        const sendBtnIcon = this.shadowRoot.querySelector('#send-btn-icon');
        if (!sendBtnIcon) {
            console.warn("send btn not found : #send-btn-icon ")
            return 
        }
        clearTimeout(typingTimer);

        const message = event.target.value;
        if (message) {
            sendBtnIcon.classList.add('visible');
                websocket.send(JSON.stringify({
                    "m": "typ", "clt": this.activeMemberId
                }));
            
            if (typingTimer)
                clearTimeout(typingTimer);
            
            typingTimer = setTimeout( () => {
                websocket.send(JSON.stringify({
                    "m": "styp", "clt": this.activeMemberId
                }));
            }
            , doneTypingInterval );

        }
        else {
            sendBtnIcon.classList.remove('visible')
        }
    }

    showMembersDivElement(event) {
        const offcanvas = this.shadowRoot.querySelector("#convo-list");
        offcanvas.style["left"] = "0";
        this.showOverlay();
        this.overlayActive = true;
        this.offcanvasActive = true;
    }
    
    handleOffcanvasSearch(event) {
        // need to be fixed ;
        const searchQuery = event.target.value.toLowerCase();
        // console.log("search ::", searchQuery);

        const membersContainer = this.shadowRoot.querySelector('#list-offcanvas-body');
        const members = membersContainer.querySelectorAll('wc-chat-member');
    
        members.forEach(member => {
            const username = member.getAttribute('username').toLowerCase();
            if (username.includes(searchQuery)) {
                member.style.display = '';
            } else {
                member.style.display = 'none';
            }
        });
    }

    handleProfileCloseOffcanvas(event) {
        const offcanvas = this.shadowRoot.querySelector('#profileOffcanvas');
        offcanvas.classList.remove('show');
        this.hideOverlay();
    }

    hideMembersDivElement(event) {
        const element = this.shadowRoot.querySelector('#convo-list');
        element.style["left"] = "-200%"
        this.overlayActive = false
        this.offcanvasActive = false
        this.hideOverlay();
    }

    handleProfileOffCanvas(event) {
        const username = this.convo_list_users[1];
		const profilePic = "assets/after.png";

        // console.log(username);
        const cprofileOffcanvasBody = this.shadowRoot.querySelector('.custom-offcanvas-body');
        cprofileOffcanvasBody.innerHTML = ``;

        const profileComponent = document.createElement('wc-chat-profile');
        const data = {
            "name": this.activeMemberUsername,
            "profilePic": profilePic,
            "phoneNumber": "0639316995",
            "description": "this is description ..."
        }
        profileComponent.addUserInfo(data)
        cprofileOffcanvasBody.appendChild(profileComponent)

        const profileOffcanvas = this.shadowRoot.querySelector('#profileOffcanvas');
        profileOffcanvas.classList.add('show');
        this.showOverlay();
    }

    showOverlay() {
        const overlay = this.shadowRoot.querySelector('.overlay');
        overlay.classList.add('show');
    }
    hideOverlay() {
        const overlay = this.shadowRoot.querySelector('.overlay');
        overlay.classList.remove('show');
    }
    handleOverlayClick() {
        this.handleProfileCloseOffcanvas();
        this.hideMembersDivElement();
    }


    async render() {
        const membersContainer = this.shadowRoot.querySelector('.members-container');
        
        //// for test
        const username = "mohamed";
        const profilePic = "assets/after.png";
        
        this.convo_list_users.forEach(user => {   
            const memberElement = document.createElement('wc-chat-member');
            memberElement.setAttribute('username', user.userName);
            memberElement.setAttribute('profile-pic', `assets/after.png`);
            memberElement.setAttribute('id', user.id);
            setTimeout( () => {
                memberElement.addUserInfo(user)
            })
            membersContainer.appendChild(memberElement);
        });
    }

    async updateUnreadMemberMessages() {
        const membersContainer = this.shadowRoot.querySelector('.members-container');

        await Promise.all(this.convo_list_users.map(async (user) => {
            if (!user.id || !user.userName) {
                console.warn(`invalid user data : ${JSON.stringify(user)}`)
                return
            }
            if (!this.databaseMessages.has(user.id)) {
                await this.fetchData(this.userId, user.id)
                
                const member =  membersContainer.querySelector(`wc-chat-member[username="${user.userName}"]`);
                if (!member) {
                    console.warn(`member element not found for user : ${JSON.stringify(user)}`)
                    return 
                }

                const messages = this.databaseMessages.get(user.id)
                if (!messages || messages.length == 0) {
                    // console.warn(`no messages data found for user : ${JSON.stringify(user)}`)
                    return 
                }

                const unreadMessagesCount = this.getUnreadMessagesCount(user.id)
                const lastMessage = messages.at(-1)
                user.unreadMessagesCount = unreadMessagesCount
                user.lastMessage = lastMessage

                member.displayMessageCounter(unreadMessagesCount, lastMessage)
                member.updateLastMessage(lastMessage)
            }
        }))
    }

    html() {
        return (
                /*html*/`
    <style>
        @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');

        :host {
            display: block;
            height: 100%;
            width: 100%;
        }

        .chat-container {
            height: 100vh;
        }

        #convo-list {
            min-width: 400px;
            background-color: #f8f9fa;
            border-right: 1px solid #b8adae;
            transition: width 0.3s ease;
        }


        #convo-messages-container {
            background-color: #e0e0e0;
            flex-grow: 1;
            transition: width 0.3s ease;
            display: flex;
            flex-direction: column;
        }

        .profile-info {
            width: 100%;
        }
        .invite-game-container {
            width: 100%;
        }
        #user-profile {
            min-width: 350px;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #f8f9fa;
            border-left: 1px solid #dee2e6;
            transition: width 0.3s ease;
            gap: 8px;
        }

        .members-container {
            overflow-y: auto;
            max-height: calc(100vh - 120px);
        }

        .search-container {
            position: relative;
            color: white;
            margin-bottom: 20px;
            display: flex;
        }

        .search-icon {
            position: absolute;
            left: 1em;
            top: 50%;
            transform: translateY(-50%);
            width: 1.5rem;
            height: 1.5rem;
            pointer-events: none;
        }

        #convo-search:focus {
            outline: none;
            border-color: #ccc;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        }

        #convo-search {
            color: #022f40;
            border-radius: 8px;
            border: 1.5px solid #dee2e6;
            padding: 10px;
            background-color: #f8f9fa;
            padding-left: 3rem;
            width: 100%;
        }

        #user-header-container {
            width: 100%;
            background-color: #f8f9fa;
            display: flex;
            flex-direction: row;
        }

        .member {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 0.5em;
            border-bottom: 1px solid #e9ecef;
        }

        .profile-pic {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 14px;
            overflow: hidden;
            border: 1px solid #e0e0e0;
        }

        #user-image {
            width: 100%;
            height: 100%;

            object-fit: cover;
        }
        .convo-username {
            font-weight: bold;
        }
        
        .convo-user-status {
            font-size: 12px;
        }

        #user-convo-header {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 2px;
        }
        #list-icon-container .list-icon, .profile-icon-container .profile-icon {
            display: none;
        }

        /* profile offcanvas */ 
            .profileOffcanvas {
                position: fixed;
                top: 0;
                right: -200%;
                height: 100%;
                background-color: #fff;
                transition: right 0.3s ease-in-out;
                z-index: 1000;
                box-shadow: -2px 0 5px rgba(0,0,0,0.1);
            }

            .profileOffcanvas.show {
                right: 0;
            }

            .profile-offcanvas-header {
                padding: 1rem;
                border-bottom: 1px solid #dee2e6;
            }


            #profileOffcanvas {
                overflow-y: auto;
            }

            #chat-conversation {
                width: 100%;
                height: 100%;
                background-color: #e0e0e0;
                overflow-y: auto;
            }
            #conversation-background {
                object-fit: contain;
                width: 100%;
                height: 100%;
            }
        
            .overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 5;
                display: none;
            }
            
            .overlay.show {
                display: block;
            }

            #user-profile, #user-header-container{
                display: none;
            }


            /* input message */
            #input-message-container {
                display: none;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                background-color: #f8f9fa;
                padding: 0.5em;
                box-sizing: border-box;
            }
            
            #message-input {
                flex-grow: 1;
                margin: 0 10px;
                border-radius: 8px;
                border: 1.5px solid #dee2e6;
                background-color: none;
                padding: 0.5em;
            }

            #message-input:focus {
                outline: none;
                border-color: #ccc;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            }

            .last-message {
                font-size: 0.8em;
                color: #6c757d;
            }

            .add-file-icon {
                cursor: pointer;
            }

            #send-btn-icon {
                cursor: pointer;
                width:  25px;
                height: 25px;
                display: none;
            }

            #send-btn-icon.visible {
                display: block;
            }
            .custom-file-upload {
                background-color: blue;
                border: 1px solid #ccc;
                color: white;
                border-radius: 4px;
                cursor: pointer;
            }
            input[type="file"] {
                display: none;
            }

            .chat-header {
                color: #385a64;
            }
            .return-icon-container {
                display: none;
            }

        #invite-game-icon {
            width: 25px;
            cursor: pointer;
        }


/*  drop down content */

    .dropdown-content {
      display: none;
      position: absolute;
      background-color: #022f40;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      flex-direction: column;
      z-index: 15;
      top: -585%;
    }
    
    .dropdown-content dt:hover {
        background: #e0e0e0;
        color: #022f40;
        cursor: pointer;
    }
    .dropdown-content dt {
      color: white;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
    }
    .dropdown-content h5 {
      color: white;
      padding: 10px 10px;
      display: block;
    }


        /* break points */
        @media (max-width: 1200px) {
            #user-profile {
                display: none !important;
            }
            .profile-icon-container .profile-icon {
                display: initial !important;
                width: 30px;
                height: 30px;
            }
        }
        

        @media (max-width: 800px) {
            #convo-list {
                position: fixed;
                top: 0;
                left: -200%;
                height: 100%;
                background-color: #fff;
                transition: right 0.3s ease-in-out;
                z-index: 20000;
                box-shadow: -2px 0 5px rgba(0,0,0,0.1);
            }
            #min {
                width: 100px;
                height: 100px;
                background-color: red;
            }
            #list-icon-container .list-icon, .profile-icon-container .profile-icon {
                display: initial !important;
                cursor: pointer;
                margin-right: 10px;
            }
            .return-icon-container {
                display: initial !important;
                position: fixed;
                top : 2%;
                left: 2%;
                cursor: pointer;
            }
            .return-icon {
                width:  20px;
                height: 20px;
            }
        }
    </style>

    <body>
        <div class="chat-container position-relative">
            
            <div class="d-flex h-100 position-relative">
            <div id="convo-list" class="p-3">
                    <h4 class="chat-header mb-3">Chats</h5>
                    <div class="search-container">
                        <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <input type="search" id="convo-search"  placeholder="Search">
                    </div>
                    <div class="members-container"></div>
                </div>

                <div id="convo-messages-container">
                    <div id="user-header-container">
                        <div class="member">             
                            <div id="user-convo-header">
                                <div id="list-icon-container">
                                    <svg class="list-icon" fill="#000000" width="25px" height="25px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M228,128.00037a12.00028,12.00028,0,0,1-12,12H40a12,12,0,0,1,0-24H216A12.00028,12.00028,0,0,1,228,128.00037Zm-188-52H216a12,12,0,0,0,0-24H40a12,12,0,1,0,0,24Zm176,104H40a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Z"/>
                                    </svg>
                                </div>
                                <div class="profile-pic">
                                    <img id="user-image" src="assets/after.png" alt="profile picture" class="img-fluid">
                                </div>
                                <div class="convo-user-heaader-info">
                                    <div class="convo-username">username</div>
                                    <div class="convo-user-status"> online</div>
                                </div>
                            </div>
                                <div class="profile-icon-container p-2">
                                    <img class="profile-icon" src="assets/info.svg" >
                                </div>
                        </div>
                    </div>

                    <div id="chat-conversation" class="p-3" class="position-relative">
                        
                        <img id="conversation-background" src="assets/conversation.png" />
                        <div class="return-icon-container">
                            <svg class="return-icon" xmlns="http://www.w3.org/2000/svg" id="Bold" viewBox="0 0 24 24" width="512" height="512"><path d="M12,24a1.493,1.493,0,0,1-1.06-.439L3.264,15.889a5.5,5.5,0,0,1,0-7.778L10.936.439a1.5,1.5,0,1,1,2.121,2.122L5.385,10.232a2.5,2.5,0,0,0,0,3.536l7.672,7.671A1.5,1.5,0,0,1,12,24Z"/><path d="M21.542,24a1.5,1.5,0,0,1-1.061-.439L11.4,14.475a3.505,3.505,0,0,1,0-4.95L20.481.439A1.5,1.5,0,0,1,22.6,2.561l-9.086,9.085a.5.5,0,0,0,0,.708L22.6,21.439A1.5,1.5,0,0,1,21.542,24Z"/></svg>
                        </div>
                    </div>
                    
                    <div id="input-message-container" >
                        <div class="input_container">
                            <label for="files" class="btn">
                                <svg class="add-file-icon" width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 11C8.10457 11 9 10.1046 9 9C9 7.89543 8.10457 7 7 7C5.89543 7 5 7.89543 5 9C5 10.1046 5.89543 11 7 11Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M5.56055 21C11.1305 11.1 15.7605 9.35991 21.0005 15.7899" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M12.28 3H5C3.93913 3 2.92172 3.42136 2.17157 4.17151C1.42142 4.92165 1 5.93913 1 7V17C1 18.0609 1.42142 19.0782 2.17157 19.8284C2.92172 20.5785 3.93913 21 5 21H17C18.0609 21 19.0783 20.5785 19.8284 19.8284C20.5786 19.0782 21 18.0609 21 17V12" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M18.75 8.82996V0.829956" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M15.5508 4.02996L18.7508 0.829956L21.9508 4.02996" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </label>
                            <input id="files" style="display:none;" type="file">
                        </div>
                        <div class="dropdown">
                            <img id="invite-game-icon" class="game-icon" src="assets/game.svg" alt="Game Icon" />
                            <div class="dropdown-content">
                                <h5>Invite Friend</h5>
                                <dl>
                                    <dt id="ping-pong">Ping pong</dt>
                                    <dt id="slap-hand">Slap Hand</dt>
                                </dl> 
                            </div>
                        </div>

                        <input id="message-input" type="text" placeholder="Type a message">
                        <svg id="send-btn-icon" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512">
                            <path d="m4.034.282C2.981-.22,1.748-.037.893.749.054,1.521-.22,2.657.18,3.717l4.528,8.288L.264,20.288c-.396,1.061-.121,2.196.719,2.966.524.479,1.19.734,1.887.734.441,0,.895-.102,1.332-.312l19.769-11.678L4.034.282Zm-2.002,2.676c-.114-.381.108-.64.214-.736.095-.087.433-.348.895-.149l15.185,8.928H6.438L2.032,2.958Zm1.229,18.954c-.472.228-.829-.044-.928-.134-.105-.097-.329-.355-.214-.737l4.324-8.041h11.898L3.261,21.912Z" fill="#0000FF"/>
                        </svg>                  
                    </div>
                </div>
                
                <div id="user-profile" class="p-3">
                    <div class="profile-info"></div>
                    <div class="invite-game-container">
                    </div>
                </div>

            </div>
        </div>

        <div class="profileOffcanvas d-flex flex-column col-lg-4 col-md-4 col-sm-6 " id="profileOffcanvas">
            <div class="profile-offcanvas-header">
                <button type="button" class="btn-close" id="profileOffcanvasCloseBtn"></button>
            </div>
            <div class="custom-offcanvas-body"></div>
        </div>
        <div class="overlay" id="overlay" ></div>

    </body>
    `
        )
    }
}
