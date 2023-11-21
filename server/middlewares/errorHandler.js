function errorHandler(error, req, res, next) {
    if (error.name === `SequelizeValidationError`) {
        let errors = error.errors.map((isi) => {
            return isi.message
        })
        res.status(400).json({ message: errors })
    } else if (error.name === `SequelizeUniqueConstraintError`) {
        let errors = error.errors.map((isi) => {
            return isi.message
        })
        res.status(409).json({ message: errors })
    } else if (error.name === `loginEmailNotFill`) {
        res.status(400).json({ message: `email must be fill` })
    } else if (error.name === `loginPasswordNotFill`) {
        res.status(400).json({ message: `password must be fill` })
    } else if (error.name === `UserNotFound`) {
        res.status(401).json({ message: `Invalid email/password` })
    } else {
        console.log(error)
        res.status(500).json({ message: `Internal Server Error` })
    }
}

module.exports = errorHandler