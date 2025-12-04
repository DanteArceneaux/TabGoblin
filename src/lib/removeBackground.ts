/**
 * Utility to remove pink background from sprite sheet using chroma key
 */

export async function removePinkBackground(imageSrc: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Draw the image
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Remove pink pixels (chroma key)
      // Target: Bright magenta #ff00ff (R:255, G:0, B:255)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Detect pink/magenta - the sprite uses bright magenta
        // Being aggressive to catch anti-aliased edges too
        const isPink = r > 200 && g < 100 && b > 200;
        
        if (isPink) {
          data[i + 3] = 0; // Make transparent
        }
      }

      // Put the modified image data back
      ctx.putImageData(imageData, 0, 0);
      
      // Convert to data URL
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = (e) => {
      console.error('Failed to load sprite image:', e);
      reject(new Error('Failed to load image'));
    };

    // Use chrome.runtime.getURL for extension-relative paths
    if (imageSrc.startsWith('/')) {
      img.src = chrome.runtime.getURL(imageSrc.slice(1));
    } else {
      img.src = imageSrc;
    }
  });
}

