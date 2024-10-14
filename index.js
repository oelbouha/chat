import { chat } from "./components/chat.js"
import { chatMember } from "./components/chat-member.js"
import { clientMessage } from "./components/client-message.js";
import { conversation } from './components/conversation.js';
import { profile } from './components/user-profile.js';
import { card } from './components/user-card.js';
import { userMessage } from './components/user-message.js';
import { websocket } from "./components/net.js";


websocket.onopen = () => {
	console.log("connection opoened .......")	
}


// websocket.onmessage = (e) => {
// 	const message = JSON.parse(e.data);

// 	console.log("received :: ", message)

// 	switch (message.m) {
// 		case "msg":
// 			handleMessage(message)
// 			break 
// 		case "st":
// 			handleMessageStatus(message)
// 			break 
// 		case "recv":
// 			handleMessageStatus(message)
// 			break 
// 		case "sn":
// 			handleMessageStatus(message)
// 			break 
// 		case "err":
// 			console.log("ther is an error in the message", message)
// 			break
// 	}

// }


// function handleMessage(message) {
// 	document.dispatchEvent(new CustomEvent('newMessage', {detail: message}))
// 	console.log ("new message:: ", message.cnt);
// }

// function handleMessageStatus(status) {
// 	document.dispatchEvent(new CustomEvent('messageStatus', {detail: status}))
// 	console.log ("message status :: ", status);
// }




websocket.onerror = function(error) {
    console.error(`WebSocket Error: ${error}`);
};

websocket.onclose = function(event) {
    console.log(`WebSocket Closed. Code: ${event.code}, Reason: ${event.reason}`);
};


let data = {
	m: "msg",
	clt: "2",
	tp: "txt",  
	cnt: "hello"
}


customElements.define("wp-chat", chat);
customElements.define("wp-chat-member", chatMember);
customElements.define("wp-chat-conversation", conversation);
customElements.define("wp-chat-profile", profile);
customElements.define("wp-card", card);
customElements.define("wp-client-message", clientMessage);
customElements.define("wp-user-message", userMessage);



/*

*   `sent` -> `st`
*   `recieve` -> `recv`
*   `seen` -> `sn`
*   `typing` -> `typ`
*   `stop typing` -> `styp`
*   `recording` -> `rcd`
*   `stop recording` -> `srcd`
*   `attachment` -> `atta`
*   `message` -> `msg`
*   `error` -> `err`
*   `type` -> `tp`
*   `client` -> `clt`
*   `voice` -> `vc`
*   `video` -> `vd`
*   `image` -> `img`
*   `identifier` -> `id`
*   `content` -> `cnt`

*/