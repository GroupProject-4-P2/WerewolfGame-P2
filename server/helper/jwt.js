const jwt = require(`jsonwebtoken`)

const secret = `verysecret`

const signToken = (payload) => {
    return jwt.sign(payload, secret)
}

const verifyToken = (token) => {
    console.log({token});
    return jwt.verify(token, secret)
}

module.exports = {signToken, verifyToken}