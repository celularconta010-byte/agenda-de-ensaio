
import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = 'public/screenshots';

async function processMobile() {
    try {
        const files = fs.readdirSync(SCREENSHOTS_DIR).filter(f => f.startsWith('WhatsApp'));

        if (files.length === 0) {
            console.log('No WhatsApp images found.');
            return;
        }

        const file = files[0];
        const filePath = path.join(SCREENSHOTS_DIR, file);
        console.log(`Processing ${file}...`);

        const image = await Jimp.read(filePath);
        await image.write(path.join(SCREENSHOTS_DIR, 'mobile.png'));
        console.log(`Converted ${file} -> mobile.png`);

        fs.unlinkSync(filePath);

    } catch (err) {
        console.error('Error processing mobile:', err);
    }
}

processMobile();
