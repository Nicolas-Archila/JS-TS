const crypto = require('crypto');

// Generar par de claves Ed25519 para PASETO v4
const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
  publicKeyEncoding: { type: 'spki', format: 'der' },
  privateKeyEncoding: { type: 'pkcs8', format: 'der' }
});

console.log('='.repeat(60));
console.log('NUEVAS CLAVES PASETO GENERADAS');
console.log('='.repeat(60));
console.log('\nCopia estas líneas en tu archivo .env:\n');
console.log(`PASETO_PUBLIC_KEY=${publicKey.toString('base64url')}`);
console.log(`PASETO_PRIVATE_KEY=${privateKey.toString('base64url')}`);
console.log('\n' + '='.repeat(60));