import jwt from 'jsonwebtoken';

//functions
export const verifyToken = async (req,res, next) => {
    try {
        const token = req.headers['x-access-token'].split(' ')[1];
        req.user = {};
        if(token){
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if(err) return res.json({
                    isLoggingIn: false,
                    message: "Failed to Authenticate",
                    err: err
                })
                req.user.id = decoded.id;
                req.user.firstName = decoded.firstName;
                req.user.lastName = decoded.lastName;
                next(); 
            })
        }else{
            res.status(406).json({message:"Token Not Acceptable"})
        }
    } catch (error) {
        res.status(406).json({message:"Token Not Acceptable"})
    }
}
