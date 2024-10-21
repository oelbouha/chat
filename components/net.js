

export const websocket = new WebSocket("ws://127.0.0.1:8000/ws/chat/room/");

export function sendMessage(message) {
	// code
}


export async function getData(user1, user2) {
	const url = `http://127.0.0.1:8000/messages/?user1=${user1}&user2=${user2}`;
	try {
	  const response = await fetch(url);
	  if (!response.ok) {
		  throw new Error(`Response status: ${response.status}`);
		}
		
		const body = await response.json();
		if (body.message == "Invalid request: user1 and user2 are required")
			return null
		return body
	}
	catch (error) {
		console.error(error.message);
		return null
	}
}


export function formatTime(time) {
	const date = new Date(time); // Parse the ISO string

	let hours = date.getUTCHours(); // Get hours in UTC
	const minutes = String(date.getUTCMinutes()).padStart(2, '0'); // Get minutes and ensure two digits
	const ampm = hours >= 12 ? 'PM' : 'AM'; // Determine AM/PM

	// Convert hours to 12-hour format
	hours = hours % 12;
	hours = hours ? hours : 12; // Convert hour '0' to '12'

	return `${hours}:${minutes} ${ampm}`; // Return formatted time
}