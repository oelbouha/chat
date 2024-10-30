// Function to get thumbnail from video file
export function getVideoThumbnail(videoFile, fileName = 'thumbnail.jpg') {
	return new Promise((resolve, reject) => {
	  const video = document.createElement('video');
	  video.preload = 'metadata';
	  video.playsInline = true;
	  video.muted = true;
  
	  const url = URL.createObjectURL(videoFile);
	  video.src = url;

	  const canvas = document.createElement('canvas');
	  const ctx = canvas.getContext('2d');
  
	  video.onloadedmetadata = () => {
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		
		const seekTime = Math.min(1.0, video.duration);
		video.currentTime = seekTime;
	  };
  
	  video.onseeked = () => {
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		
		canvas.toBlob((blob) => {
		  // Clean up
		  URL.revokeObjectURL(url);
		  
		  // Create a File object from the blob
		  const thumbnailFile = new File(
			[blob],
			fileName,
			{ type: 'image/jpeg', lastModified: Date.now() }
		  );
		  
		  resolve({
			file: thumbnailFile,
			width: canvas.width,
			height: canvas.height
		  });
		}, 'image/jpeg', 0.8);
	  };
  
	  video.onerror = (error) => {
		URL.revokeObjectURL(url);
		reject(error);
	  };
	});
  }
  
  // Example usage:
  async function handleVideoFile(videoFile) {
	try {
	  // Generate a custom filename based on the original video name
	  const baseName = videoFile.name.replace(/\.[^/.]+$/, '');
	  const thumbnailName = `${baseName}_thumbnail.jpg`;
	  
	  const result = await getVideoThumbnail(videoFile, thumbnailName);
	  
	  // Now you can use the thumbnail file
	  console.log('Thumbnail file:', result.file);
	  console.log('File name:', result.file.name);
	  console.log('File size:', result.file.size);
	  console.log('Dimensions:', result.width, 'x', result.height);
  
	  // Example: Upload the thumbnail
	  // const formData = new FormData();
	  // formData.append('thumbnail', result.file);
	  // await fetch('/upload', { method: 'POST', body: formData });
  
	  // Example: Download the thumbnail
	  const downloadUrl = URL.createObjectURL(result.file);
	  const a = document.createElement('a');
	  a.href = downloadUrl;
	  a.download = result.file.name;
	  a.click();
	  URL.revokeObjectURL(downloadUrl);
	  
	} catch (error) {
	  console.error('Error generating thumbnail:', error);
	}
  }
  
//   // Use with file input
//   const fileInput = document.querySelector('input[type="file"]');
//   fileInput.addEventListener('change', (e) => {
// 	const file = e.target.files[0];
// 	if (file && file.type.startsWith('video/')) {
// 	  handleVideoFile(file);
// 	}
//   });