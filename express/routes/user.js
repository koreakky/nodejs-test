const express = require('express');

const router = express.Router();

//GET /user 에서 요청을 처리함.
router.get('/', (req, res) => {
    res.send('Hello, user!!');
});

module.exports = router;