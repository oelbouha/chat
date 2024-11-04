/*******      profile  Component ******/


export class profile extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:'open'});

        this.container = document.createElement('div')
        this.container.innerHTML = this.html()
		this.shadowRoot.appendChild(this.container);
        
        this.profiledata = {
            "name": "",
            "profilePic": "",
            "phoneNumber": "",
            "discription": "",
        }
    }
    
    connectedCallback() {
    }
    
    addUserInfo(data) {
        if (data) {
            this.profiledata.name = data.name
            this.profiledata.phoneNumber = data.phoneNumber
            this.profiledata.profilePic = data.profilePic
            this.profiledata.description = data.description

            this.render()
        }
    }
    render() {
        if (!this.profiledata) return 

        const userProfileInfo = this.shadowRoot.querySelector('#user-profile-info');

        // set username
        const wp_card = document.createElement('wc-card');
        const userNameIcon = "assets/circle-user.svg";
        wp_card.addUserInfo('name', this.profiledata.name, userNameIcon);
        userProfileInfo.appendChild(wp_card);
        
        // set phone number
        const phoneNUmberIcon = "assets/phone.svg";
        const wcPhone = document.createElement('wc-card');
        wcPhone.addUserInfo("phone", this.profiledata.phoneNumber, phoneNUmberIcon)
        userProfileInfo.appendChild(wcPhone);
        
        // set description
        const descriptionIcon = "assets/description.svg";
        const wcDescription = document.createElement('wc-card');
        wcDescription.addUserInfo('description', this.profiledata.description, descriptionIcon);
        userProfileInfo.appendChild(wcDescription);

    
        const userImageElement = this.shadowRoot.querySelector('.user-image');
        const usernameElement = this.shadowRoot.querySelector('.user-name');

        userImageElement.src = this.profiledata.profilePic;
        usernameElement.textContent = this.profiledata.name;
    }
    
    html() {
        return (
            /*html*/ `
            <style>
            @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
        
        :host {
            display: block;
        }
            
        .profile-container {
            display: flex;
            flex-direction: column;
            gap: 1em;
            height: 100%;
            width: 100%;
            overflow-y: auto;
        }

        .profile-pic {
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: #022f40;
            border-radius: 14px;
        }
        .user-image {
            width:  150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
        }


        .profile-header {
            font-weight: bold;
        }

        #user-profile-info {
            color: white;
            background-color: #022f40;
            border-radius: 14px;
        }

        </style>
        <div class="profile-container p-4">
        <div class="profile-header">
            <h3 >Profile info</h3>
        </div>
        
        <div class="profile-pic p-3">
            <img class="user-image" src="/api/placeholder/50/50" alt="profile picture">
            <h4 class="user-name"></h4>
        </div>
        <div id="user-profile-info" class="p-3"></div>
        </div>
        `
        )
    }
}