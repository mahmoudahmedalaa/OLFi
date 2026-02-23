const fs = require('fs');
const PNG = require('pngjs').PNG;

fs.createReadStream('assets/images/splash-icon.png')
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function () {
    let cx = Math.floor(this.width / 2), cy = Math.floor(this.height / 2);
    let idx = (this.width * cy + cx) << 2;
    console.log('Center px:', this.data[idx], this.data[idx + 1], this.data[idx + 2], this.data[idx + 3]);
    console.log('Top-Left px:', this.data[0], this.data[1], this.data[2], this.data[3]);
  });
