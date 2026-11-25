// Cetak semua kalimat narator (JSON) dari app/src/main/assets/data.js
const d = require('../app/src/main/assets/data.js');
process.stdout.write(JSON.stringify(d.allLines()));
