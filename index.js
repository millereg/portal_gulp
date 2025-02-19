const fs = require('fs');

fs.readdir('assets/img/', (err, files) => {
    if (err) {
        console.error('Error leyendo la carpeta:', err);
    } else {
        console.log('Archivos encontrados:', files);
    }
});
