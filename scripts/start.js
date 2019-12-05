const { spawn, execSync } = require('child_process')
const { readdirSync } = require('fs')
const { cp } = require('shelljs')

const day = process.argv[2]
const days = readdirSync('./src')
const dayPath = day.toString().padStart(2, '0')

if (!days.includes(dayPath)) {
  console.log(`Creating file structure for ${dayPath}...`)
  cp('-r', 'src/template', `src/${dayPath}`)
}

spawn('nodemon', [`src/${dayPath}/index.js`], {
  stdio: 'inherit'
})
