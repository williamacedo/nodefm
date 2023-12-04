import prisma from '../db'
import { comparePasswords, createJWT, hasPassoword } from '../modules/auth'

export const createNewUser = async (req, res) => {
    const user = await prisma.user.create({
        data: {
            username: req.body.username,
            password: await hasPassoword(req.body.password)
        }
    })

    const token = createJWT(user)
    res.json({ token });
}

export const signin = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            username: req.body.username,
        }
    })

    const isValid = await comparePasswords(req.body.password, user.password)

    if (!isValid) {
        req.status(401)
        res.json({ message: 'nope' })
        return
    }

    const token = createJWT(user);
    res.json({ token })
}