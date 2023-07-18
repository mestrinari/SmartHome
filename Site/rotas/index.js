const router = require('express').Router()

const devices = require('./devices')
router.use('/devices', devices)


router.get('/', (req, res)=>{
    res.json({
        succes: false,
        message: "Nem vem com graça, sai fora!"
    })
})



module.exports = router