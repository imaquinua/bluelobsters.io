#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('\n🚀 BlueLobsters Authentication Server\n');
console.log('📋 Instrucciones:');
console.log('   1. Abre tu navegador');
console.log('   2. Ve a: http://localhost:3000');
console.log('   3. NO abras los archivos HTML directamente');
console.log('   4. Usa SIEMPRE el servidor local\n');

console.log('🔧 Iniciando servidor...\n');

// Start the server
const server = spawn('node', ['server.js'], {
    stdio: 'inherit',
    cwd: __dirname
});

server.on('close', (code) => {
    console.log(`\n🛑 Servidor cerrado con código: ${code}`);
});

server.on('error', (err) => {
    console.error('❌ Error al iniciar servidor:', err);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Cerrando servidor...');
    server.kill('SIGINT');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Cerrando servidor...');
    server.kill('SIGTERM');
    process.exit(0);
});