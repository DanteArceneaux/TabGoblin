/**
 * Pre-process sprite sheets to remove pink background
 * Run with: node scripts/process-sprites.js
 */

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function processSprites() {
  try {
    const inputPath = path.join(__dirname, '../sprites/Gemini_Generated_Image_png.png');
    const outputPath = path.join(__dirname, '../public/goblin-sprite.png');
    
    console.log('Processing sprite...');
    console.log(`Input: ${inputPath}`);
    
    // Read the image and ensure it has alpha channel
    const image = sharp(inputPath).ensureAlpha();
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    
    console.log(`Image size: ${info.width}x${info.height}, channels: ${info.channels}`);
    
    // First, sample some pixels to see what colors we're dealing with
    console.log('Sampling pixel colors:');
    const samplePositions = [0, 100, 1000, 5000, 10000];
    for (const pos of samplePositions) {
      const idx = pos * 4;
      if (idx < data.length) {
        console.log(`  Pixel ${pos}: R=${data[idx]}, G=${data[idx+1]}, B=${data[idx+2]}, A=${data[idx+3]}`);
      }
    }
    
    // Process pixels - remove pink/magenta background
    // The pink appears to be around RGB(255, 0, 255) or similar bright magenta
    let pinkPixelsRemoved = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Detect pink/magenta - adjusted for actual colors (~215, 38, 160)
      // Pink has high R, low G, medium-high B
      const isPink = r > 180 && g < 80 && b > 140 && b < 200;
      
      if (isPink) {
        data[i + 3] = 0; // Set alpha to 0 (transparent)
        pinkPixelsRemoved++;
      }
    }
    
    console.log(`Removed ${pinkPixelsRemoved} pink pixels`);
    
    // Save with transparency
    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .png()
    .toFile(outputPath);
    
    console.log('✅ Sprite processed successfully!');
    console.log(`   Output: ${outputPath}`);
    
  } catch (err) {
    console.error('Error processing sprite:', err);
  }
}

processSprites();

