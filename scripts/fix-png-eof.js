import fs from 'fs';
import path from 'path';

const filesToCheck = [
    'public/icon-192x192.png',
    'public/icon-512x512.png',
    'public/screenshots/mobile.png',
    'public/screenshots/desktop.png'
];

const IEND_CRC = Buffer.from([0xAE, 0x42, 0x60, 0x82]); // CRC of IEND chunk
const IEND_CHUNK = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82]);

console.log('Sanitizando arquivos PNG (truncando após IEND)...');

filesToCheck.forEach(file => {
    try {
        const filePath = path.resolve(process.cwd(), file);
        if (!fs.existsSync(filePath)) {
            console.log(`[AUSENTE] ${file}`);
            return;
        }

        const buffer = fs.readFileSync(filePath);
        // Find the IEND chunk sequence
        const iendIndex = buffer.lastIndexOf(IEND_CHUNK);

        if (iendIndex === -1) {
            console.log(`[ERRO] ${file}: Chunk IEND não encontrado.`);
            return;
        }

        const expectedEnd = iendIndex + IEND_CHUNK.length;
        const actualSize = buffer.length;

        if (actualSize > expectedEnd) {
            console.log(`[CORRIGINDO] ${file}`);
            console.log(`  Tamanho atual: ${actualSize}`);
            console.log(`  Tamanho esperado: ${expectedEnd}`);
            console.log(`  Bytes extras: ${actualSize - expectedEnd}`);

            const cleanBuffer = buffer.subarray(0, expectedEnd);
            fs.writeFileSync(filePath, cleanBuffer);
            console.log(`  -> Arquivo truncado e salvo.`);
        } else {
            console.log(`[OK] ${file}: Sem bytes extras.`);
        }

    } catch (err) {
        console.error(`Erro ao processar ${file}:`, err.message);
    }
});
