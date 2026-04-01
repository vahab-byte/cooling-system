import net from 'net'
import dotenv from 'dotenv'
dotenv.config()

const host = 'db.ltomdnhuqxpwvsccicya.supabase.co'
const ports = [5432, 6543]

console.log(`Checking connection to ${host}...`)

ports.forEach(port => {
  const socket = new net.Socket()
  socket.setTimeout(5000)
  
  socket.on('connect', () => {
    console.log(`Port ${port} is OPEN`)
    socket.destroy()
  })
  
  socket.on('timeout', () => {
    console.log(`Port ${port} TIMEOUT`)
    socket.destroy()
  })
  
  socket.on('error', (err) => {
    console.log(`Port ${port} ERROR: ${err.message}`)
  })
  
  socket.connect(port, host)
})
