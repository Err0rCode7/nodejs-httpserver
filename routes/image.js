const express = require('express');
const router = express.Router();

// Get images

router.get('/', (req,res,next) => {
    console.log(req.url);
});

module.exports = router;