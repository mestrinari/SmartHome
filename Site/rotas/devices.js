const router = require('express').Router()
const Device = require('../model/Devices')

router.get('/', async (req, res)=>{
    try{
        const listaDevices = await Device.find()
        res.json({
        success: true,
        message: listaDevices 
    })
}
    catch{
        res.json({
            success: false,
            message: "nao foi possivel listar os treco " 
        })
    }
})

router.post('/', async (req,res)=>{
    const novoDevice = new Device({
        nome: req.body.nome,
        umidade: req.body.umidade,
        motorStatus: req.body.motorStatus 
    })

    try{
        const saveNovoDevice = await novoDevice.save()
        res.json({
            success: true,
            message: saveNovoDevice
        })
    }
    catch{
        res.json({
            success: false,
            message: "nao foi possivel cadastrar novo bagulho " 
        })
    }
 })


 router.put('/:id', async (req,res)=>{

    try{
        const updateDeviceId = await Device.updateOne(
            {_id: req.params.id},
            {umidade: req.body.umidade}
        )
        res.json({
            success: true,
            updated: updateDeviceId.nModified
        })
    }
    catch(err){
        res.json({
            success: false,
            message: "nao foi possivel atualizar a bagaça" 
        })
    }
 })
 router.delete('/:id', async (req,res)=>{
   
    try{
        const deleteMedidasId = await Medidas.deleteOne({
            _id: req.params.id
    });
        res.json({
            success: true,
            message: deleteMedidasId
        })
    }
    catch{
        res.json({
            success: false,
            message: "nao foi possivel deletar este trem" 
        })
    }
 })

module.exports = router