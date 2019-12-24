import { spawn } from 'child_process'

export default (filename: string): void => {
  spawn('node', ['dist/trimmer.js', filename], {
    stdio: 'ignore', // piping all stdio to /dev/null
    detached: true
  })
}
