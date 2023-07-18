const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
const api = require('./rotas/')
app.use('/api', api)
const PORT = 3000

app.get('/', (req, res)=>{
    res.json({
        sucess: true
    })
})
app.listen(PORT)