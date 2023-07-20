const router = require('express').Router();
require('../mongoDB/mongoconn')

const devices = require('./devices');
router.use('/devices', devices);

router.get('/', (req, res) => {
  res.json({
    success: false,
    message: "Nem vem com graça, sai fora!",
  });
});

module.exports = router;
