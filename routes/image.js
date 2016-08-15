var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */

router.get('/users/:user_id/:photo_name', function(req, res)
{
    console.log("\n\nHere\n");
    res.sendFile(path.resolve("image/users/" + req.params.user_id + "/" + req.params.photo_name));
});

module.exports = router;
