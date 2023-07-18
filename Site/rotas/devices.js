const router = require("express").Router()


router.get('/', (req, res)=>{
    const devices=[{
    id: 123,
    nome: "Luz do quarto",
    kwh: 23,
    corrente: 0,
    voltagem: 0,
    fp: 0,
}]
res.json({
    succes: true,
    devices: devices
})
})

router.post('/', (req,res)=>{
    res.json(req.body)
})
module.exports = router