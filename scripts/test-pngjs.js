import fs from 'fs';
import { PNG } from 'pngjs';
import path from 'path';

const filesToCheck = [
    'public/icon-192x192.png',
    'public/icon-512x512.png',
    'public/screenshots/mobile.png',
    'public/screenshots/desktop.png'
];

console.log('Testando parser PNGJS (Sync) em arquivos...');

filesToCheck.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
        console.log(`[AUSENTE] ${file}`);
        return;
    }

    try {
        const buffer = fs.readFileSync(filePath);
        const png = PNG.sync.read(buffer);
        console.log(`[OK] ${file}: Parsed successfully (Sync). Size: ${png.width}x${png.height}`);

        // Rewrite to sanitize
        const newBuffer = PNG.sync.write(png);
        fs.writeFileSync(filePath, newBuffer);
        console.log(`  -> Sanitized and saved.`);
    } catch (error) {
        console.error(`[ERRO] ${file}: ${error.message}`);
    }
});
