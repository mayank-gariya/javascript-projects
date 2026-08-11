document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('mediaUpload');
  const fileNameDisplay = document.getElementById('fileName');
  const hitBtn = document.getElementById('hitBtn');
  const uploadBox = document.querySelector('.upload-box');
  const outputContainer = document.getElementById('outputContainer');

  let currentFile = null;
  let loadedImage = null; // Stores image in memory once loaded

  // --- 1. Handle Click Uploads ---
  fileInput.addEventListener('change', (e) => {
    handleFileSelection(e.target.files);
  });

  // --- 2. Handle Drag & Drop Uploads ---
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadBox.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    uploadBox.addEventListener(eventName, () => {
      uploadBox.style.borderColor = '#ffa500';
      uploadBox.style.background = '#2a2a2a';
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    uploadBox.addEventListener(eventName, () => {
      uploadBox.style.borderColor = '#ff8c00';
      uploadBox.style.background = '#1e1e1e';
    });
  });

  uploadBox.addEventListener('drop', (e) => {
    handleFileSelection(e.dataTransfer.files);
  });

  // --- 3. Process File Selection ---
  function handleFileSelection(files) {
    if (files && files.length > 0) {
      currentFile = files[0];
      fileNameDisplay.textContent = `Selected: ${currentFile.name}`;
      
      // Load file into memory for canvas rendering
      const reader = new FileReader();
      reader.onload = (e) => {
        loadedImage = new Image();
        loadedImage.onload = () => {
          console.log(`Image ready: ${loadedImage.width}x${loadedImage.height}`);
        };
        loadedImage.src = e.target.result;
      };
      reader.readAsDataURL(currentFile);
    }
  }

  // --- Helper: Convert File to Base64 ---
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // --- Helper: Render Image & Detection Bounding Boxes ---
  function renderDetectionsOnCanvas(img, detections) {
    outputContainer.innerHTML = ''; // Clear past results

    const canvas = document.createElement('canvas');
    canvas.id = 'detectionCanvas';
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    const ctx = canvas.getContext('2d');

    // 1. Draw original image onto canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // 2. Draw bounding boxes returned from FastAPI / MediaPipe
    if (detections && detections.length > 0) {
      detections.forEach(det => {
        const { x, y, width, height } = det.bounding_box;

        // Bounding Box
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = Math.max(3, canvas.width / 250);
        ctx.strokeRect(x, y, width, height);

        // Tag Background
        const labelText = `${det.label} (${Math.round(det.confidence * 100)}%)`;
        ctx.font = `bold ${Math.max(16, canvas.width / 35)}px sans-serif`;
        const textWidth = ctx.measureText(labelText).width;
        
        ctx.fillStyle = 'rgba(0, 255, 0, 0.85)';
        ctx.fillRect(x, y > 30 ? y - 30 : y, textWidth + 12, 30);

        // Tag Text
        ctx.fillStyle = '#000000';
        ctx.fillText(labelText, x + 6, y > 30 ? y - 8 : y + 22);
      });
    } else {
      // Message if no objects detected
      ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
      ctx.fillRect(10, 10, 280, 40);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('No objects detected', 20, 36);
    }

    outputContainer.appendChild(canvas);
  }

  // --- 4. Process API Request ---
  hitBtn.addEventListener('click', async () => {
    if (!currentFile || !loadedImage) {
      alert('Please select or drop an image file first!');
      return;
    }

    const originalText = hitBtn.textContent;
    hitBtn.textContent = 'Processing...';
    hitBtn.style.opacity = '0.7';
    hitBtn.disabled = true;

    try {
      const base64Image = await fileToBase64(currentFile);

      const response = await fetch('http://localhost:8000/api/v1/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: base64Image }),
      });

      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

      const result = await response.json();
      console.log('FastAPI Result:', result);

      // Render image + detections onto canvas
      renderDetectionsOnCanvas(loadedImage, result.detections);

    } catch (error) {
      console.error('Error during processing:', error);
      alert('Failed to process image. Make sure FastAPI server is running on http://localhost:8000');
    } finally {
      hitBtn.textContent = originalText;
      hitBtn.style.opacity = '1';
      hitBtn.disabled = false;
    }
  });
});