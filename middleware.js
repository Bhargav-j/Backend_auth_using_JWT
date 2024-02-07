const jwt = require("jsonwebtoken");

module.exports = function(req, res, next){
    try {
        let token = req.headers['x-token'];
        if(!token){
            return res.status(400).send("Token not found")
        }

        let decode = jwt.verify(token, 'jwtSecret');
        // console.log(decode)
        // let payload = {
        //     user : {
        //         id : exists.id
        //     }
        // }

        req.user = decode.user
        next();

    } catch (error) {
        console.log(error.message)
        res.status(500).send("Invalid Token")
    }
}