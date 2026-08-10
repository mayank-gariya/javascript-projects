document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('mediaUpload');
  const fileNameDisplay = document.getElementById('fileName');
  const hitBtn = document.getElementById('hitBtn');
  const uploadBox = document.querySelector('.upload-box');

  let currentFile = null;

  // --- 1. Handle Click Uploads ---
  fileInput.addEventListener('change', (e) => {
    handleFileSelection(e.target.files);
  });

  // --- 2. Handle Drag & Drop Uploads ---
  // Prevent default browser behavior for drag events
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadBox.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  // Add visual feedback when dragging over
  ['dragenter', 'dragover'].forEach(eventName => {
    uploadBox.addEventListener(eventName, () => {
      uploadBox.style.borderColor = '#ffa500';
      uploadBox.style.background = '#2a2a2a';
    });
  });

  // Remove visual feedback when drag leaves or drops
  ['dragleave', 'drop'].forEach(eventName => {
    uploadBox.addEventListener(eventName, () => {
      uploadBox.style.borderColor = '#ff8c00';
      uploadBox.style.background = '#1e1e1e';
    });
  });

  // Capture the dropped file
  uploadBox.addEventListener('drop', (e) => {
    handleFileSelection(e.dataTransfer.files);
  });

  // --- 3. Process the Selected File ---
  function handleFileSelection(files) {
    if (files && files.length > 0) {
      currentFile = files[0];
      fileNameDisplay.textContent = `Selected: ${currentFile.name}`;
      
      // Optional: You can read the file size or type here
      console.log(`File queued: ${currentFile.name} (${Math.round(currentFile.size / 1024)} KB)`);
    }
  }

  // --- 4. Handle "Hit me" Button Click (FastAPI Integration Ready) ---
  hitBtn.addEventListener('click', async () => {
    if (!currentFile) {
      alert('Please select or drop a media file first!');
      return;
    }

    // Update button state
    const originalText = hitBtn.textContent;
    hitBtn.textContent = 'Processing...';
    hitBtn.style.opacity = '0.7';
    hitBtn.disabled = true;

    try {
      // ---------------------------------------------------------
      // FASTAPI CONNECTION TEMPLATE (Uncomment to use)
      // ---------------------------------------------------------
      /*
      const formData = new FormData();
      formData.append('file', currentFile);

      const response = await fetch('http://localhost:8000/process-media', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const result = await response.json();
      console.log('OpenCV/MediaPipe Results:', result);
      */
      
      // Simulating a backend processing delay for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert(`Success! Sent ${currentFile.name} to the backend.`);

    } catch (error) {
      console.error('Error during processing:', error);
      alert('Failed to process the media file. Check the console.');
    } finally {
      // Restore button state
      hitBtn.textContent = originalText;
      hitBtn.style.opacity = '1';
      hitBtn.disabled = false;
    }
  });
});