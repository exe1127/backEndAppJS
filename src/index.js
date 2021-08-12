import app from './app'
import './baseDatos/conexion'

app.listen(app.get('port'))

console.log('servidor encendido pòrt',app.get('port'))