import { chat } from "./components/chat.js"
import { chatMember } from "./components/chat-member.js"
import { conversation } from './components/conversation.js';
import { profile } from './components/user-profile.js';
import { card } from './components/user-card.js';
import { textMessage } from './components/text-message.js';
import { websocket } from "./components/net.js";
import { inviteModal } from "./components/inviteModal.js";
import { imageMessage } from "./components/image-message.js";
import { videoMessage } from "./components/video-message.js";




customElements.define("wc-chat", chat);
customElements.define("wc-chat-member", chatMember);
customElements.define("wc-chat-conversation", conversation);
customElements.define("wc-chat-profile", profile);
customElements.define("wc-card", card);
customElements.define("wc-text-message", textMessage);
customElements.define("wc-image-message", imageMessage);
customElements.define("wc-video-message", videoMessage);





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