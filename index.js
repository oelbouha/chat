import { chat } from "./components/chat.js"
import { chatMember } from "./components/chat-member.js"
import { profile } from './components/user-profile.js';
import { card } from './components/user-card.js';
import { textMessage } from './components/text-message.js';
import { websocket } from "./components/net.js";
import { imageMessage } from "./components/image-message.js";
import { videoMessage } from "./components/video-message.js";
import { gameInvite } from "./components/game-invite.js"
import { gameRequest } from "./components/game-request.js"




customElements.define("wc-chat", chat);
customElements.define("wc-chat-member", chatMember);
customElements.define("wc-chat-profile", profile);
customElements.define("wc-card", card);
customElements.define("wc-text-message", textMessage);
customElements.define("wc-image-message", imageMessage);
customElements.define("wc-video-message", videoMessage);
customElements.define("wc-game-invite", gameInvite);
customElements.define("wc-game-request", gameRequest);

