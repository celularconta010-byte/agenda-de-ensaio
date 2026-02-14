
import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = 'public/screenshots';

async function processScreenshots() {
    try {
        const files = fs.readdirSync(SCREENSHOTS_DIR).filter(f => !f.startsWith('.'));
        console.log(`Found ${files.length} files in ${SCREENSHOTS_DIR}`);

        let mobileFound = false;
        let desktopFound = false;

        for (const file of files) {
            const filePath = path.join(SCREENSHOTS_DIR, file);
            console.log(`Processing ${file}...`);

            try {
                const image = await Jimp.read(filePath);
                const { width, height } = image.bitmap;
                console.log(`Dimensions: ${width}x${height}`);

                let newName = '';

                if (width < height) {
                    // Portrait -> Mobile
                    if (!mobileFound) {
                        newName = 'mobile.png';
                        mobileFound = true;
                    } else {
                        console.log('Mobile screenshot already exists, skipping rename for secondary mobile image.');
                        continue;
                    }
                } else {
                    // Landscape -> Desktop
                    if (!desktopFound) {
                        newName = 'desktop.png';
                        desktopFound = true;
                    } else {
                        console.log('Desktop screenshot already exists, skipping rename for secondary desktop image.');
                        continue;
                    }
                }

                if (newName) {
                    const newPath = path.join(SCREENSHOTS_DIR, newName);

                    // Convert and write to new path
                    await image.write(newPath);
                    console.log(`Renamed/Converted ${file} -> ${newName}`);

                    // Delete original if name is different
                    if (file !== newName) {
                        fs.unlinkSync(filePath);
                        console.log(`Deleted original ${file}`);
                    }
                }

            } catch (err) {
                console.error(`Error processing ${file}:`, err.message);
            }
        }

    } catch (err) {
        console.error('Error in processScreenshots:', err);
    }
}

processScreenshots();
