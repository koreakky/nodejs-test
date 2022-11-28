const express = require('express');

const router = express.Router();

// GET / 에서 요청을 처리함.
router.get('/', (req, res) => {
    res.send('Hello, Express!!');
});

module.exports = router;