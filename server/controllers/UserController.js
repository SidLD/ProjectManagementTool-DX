import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt'
import Jwt from "jsonwebtoken"
const prisma = new PrismaClient()

export const login = async (req, res) => {
    try {
        const params = req.body
        const user = await prisma.user.findFirst({
            where: {
                email: params.email
            },
            select: {
                password: true,
                firstName: true,
                lastName: true,
                gender: true,
                id: true,
            }
        })
        if(user){
            bcrypt.compare(params.password, user.password)
            .then((data) => {
                const payload = {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    gender: user.gender
                };
                Jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    { expiresIn: "1d" },
                    async (err, token) => {
                        if(err){
                            res.status(400).send({ok:data, message: err.message})
                        }else{
                            res.status(200).send({ok:data, token: token})
                        }
                    }
                )  
            })
            .catch((err)=> {
              res.status(400).send({ok:false, data:"Incorrect Email or Password" })  
            })
        }else{
            res.status(400).send({ok:false, data:"Incorrect Email or Password" })
        }
    } catch (error) {
        res.status(400).send({ok:false,message: error.message})
    }
}
export const register = async (req, res) => {
    try {
        let params = req.body
        params.password = await bcrypt.hash(params.password, 10);
        console.log(params)
        const data = await prisma.user.create({
            data: params
        })
        res.status(200).send({ok:true, data})
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false,message: "Invalid Data or Email Already Taken"})
    }
}
export const getUsers = async (req, res) => {
    try {
        const params = req.query
        const data = await prisma.user.findMany({
            where: {
                OR: [
                    {email: params.email},
                    {firstName: params.firstName},
                    {lastName: params.lastName}
                ]
            },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                id : true,
            },
        })
        res.status(200).send({ok:true,data})
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false, message: error.message})
    }
}
export const updateUser = async (req, res) => {
    try {
        const userId = req.user.id
        let params = req.body
        params.password = undefined
        const data = await prisma.user.update({
            where: {
                id: userId
            },
            data: params,
        })
        res.status(200).send({ok: true, data})
    } catch (error) {
        console.log(error.message)
        res.status(400).send({ok:false, message: error.message})
    }
}
export const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id
        const data = await prisma.user.delete({
            where: {
                id: userId
            }
        })
        res.status(200).send({ok:true, data})
    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false,message: "User Not Found"})
    }
}
