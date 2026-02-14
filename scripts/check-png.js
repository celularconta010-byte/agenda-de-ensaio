import fs from 'fs';
import path from 'path';

const filesToCheck = [
    'public/icon-192x192.png',
    'public/icon-512x512.png',
    'public/screenshots/mobile.png',
    'public/screenshots/desktop.png'
];

console.log('Verificando assinaturas de arquivos PNG...');

filesToCheck.forEach(file => {
    try {
        const filePath = path.resolve(process.cwd(), file);
        if (!fs.existsSync(filePath)) {
            console.log(`[AUSENTE] ${file}`);
            return;
        }

        const buffer = fs.readFileSync(filePath);
        const header = buffer.subarray(0, 8).toString('hex').toUpperCase();
        const expected = '89504E470D0A1A0A';
        const isPng = header === expected;

        console.log(`[${isPng ? 'OK' : 'ERRO'}] ${file}`);
        console.log(`  Header: ${header}`);
        console.log(`  Expected: ${expected}`);

        if (!isPng) {
            if (header.startsWith('FFD8FF')) {
                console.log('  -> Parece ser um JPEG (Magic Number: FFD8FF...)');
            } else {
                console.log('  -> Formato desconhecido.');
            }
        }
    } catch (err) {
        console.error(`Erro ao ler ${file}:`, err.message);
    }
});
