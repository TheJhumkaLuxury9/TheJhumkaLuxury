// generate-thumbs.js
// Usage: npm install then npm run generate-thumbs
// Produces thumbnails at images/thumbnails/jhumka1.jpg ... jhumka12.jpg

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const SRC = path.join(__dirname, '..', 'images', 'large')
const OUT = path.join(__dirname, '..', 'images', 'thumbnails')

if(!fs.existsSync(SRC)){
  console.error('Source folder not found:', SRC)
  process.exit(1)
}
if(!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })

async function run(){
  const files = fs.readdirSync(SRC).filter(f => /jhumka\d+\.(jpg|jpeg|png)$/i.test(f)).sort()
  if(files.length === 0){
    console.error('No jhumka images found in', SRC)
    process.exit(1)
  }
  const max = Math.min(12, files.length)
  for(let i=0;i<max;i++){
    const fname = files[i]
    const inPath = path.join(SRC, fname)
    const outName = `jhumka${i+1}.jpg`
    const outPath = path.join(OUT, outName)
    try{
      await sharp(inPath)
        .resize({ width: 480 })
        .jpeg({ quality: 80 })
        .toFile(outPath)
      console.log('Created', outName)
    }catch(err){
      console.error('Error processing', fname, err)
    }
  }
}

run()
