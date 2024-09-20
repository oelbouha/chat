const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

let typingTimer;
let typingInterfal = 1000;


function onTypingStarted() {
	console.log("start Typing ...");
}

function onTypingStopped() {
	console.log("Typing stopped ...");
}

function sendMessage() {
	const message = messageInput.value.trim();
	messageInput.value = "";
	messageInput.focus();
	console.log("message input ::", message);
}

messageInput.addEventListener('input', function () {
	if (messageInput.value) {
		onTypingStarted();
		typingTimer = setTimeout(onTypingStopped, typingInterfal);
	}
	else
		onTypingStopped();
});


messageInput.addEventListener('keypress', function (e) {
	if (e.key == "Enter")
		sendMessage();
});

sendButton.addEventListener("click", function() {
	sendMessage();
});