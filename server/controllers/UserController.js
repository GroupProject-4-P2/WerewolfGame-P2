const { hashPassword, comparePassword } = require("../helper/bcrypt")
const { signToken } = require("../helper/jwt")
const {User} = require(`../models`)
const { OAuth2Client } = require(`google-auth-library`);
const client = new OAuth2Client();
class UserController {
    static async createUser(req, res, next) {
        try {
            const { name, email, password } = req.body
            const user = await User.create({ name, email, password: hashPassword(password) })
            res.status(201).json({ "id": user.id, "email": user.email })
        } catch (error) {
            next(error)
        }
    }

    static async loginUser(req, res, next) {
        try {
            const { email, password } = req.body
            if (!email) {
                throw ({ name: `loginEmailNotFill` })
            }
            if (!password) {
                throw ({ name: `loginPasswordNotFill` })
            }
            const user = await User.findOne({ where: { email: email } })
            if (!user) {
                throw ({ name: `UserNotFound` })
            }
            const isValidPasword = comparePassword(password, user.password)
            if (!isValidPasword) {
                throw ({ name: `UserNotFound` })
            }
            const access_token = signToken({ id: user.id })
            res.status(200).json({ access_token})
        } catch (error) {
            next(error)
        }
    }

    static async loginGoogle(req, res, next) {
        try {
            const ticket = await client.verifyIdToken({
                idToken: req.headers.g_token,
                audience: `199027147966-oeto1p8safjjv895uh1rfa5emrmnehok.apps.googleusercontent.com`
            });
            const payload = ticket.getPayload();

            let user = await User.findOne({
                where: {
                    email: payload.email
                }
            })
            if (!user) {
                user = await User.create({
                    name: payload.name,
                    email: payload.email,
                    password: hashPassword(String(Math.random()))
                })
            }
            const access_token = signToken({ id: user.id })
            res.status(200).json({ access_token})
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController