import { chat } from "./components/chat.js"
import { chatMember } from "./components/chat-member.js"
import { clientMessage } from "./components/client-message.js";
import { conversation } from './components/conversation.js';
import { profile } from './components/user-profile.js';
import { card } from './components/user-card.js';
import { userMessage } from './components/user-message.js';


customElements.define("wp-chat", chat);
customElements.define("wp-chat-member", chatMember);
customElements.define("wp-chat-conversation", conversation);
customElements.define("wp-chat-profile", profile);
customElements.define("wp-card", card);
customElements.define("wp-client-message", clientMessage);
customElements.define("wp-user-message", userMessage);