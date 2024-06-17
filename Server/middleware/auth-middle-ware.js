import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const authMiddleWare = async (req, res, next) => {
    console.log('authMiddlweare called', req);
    const token = req.cookies?.token || req.header('Authorization');
    console.log('token', token);
    try {
        if (token) {
            const jwtToken = token.replace("Bearer", "").trim();
            console.log("token form auth middleware", jwtToken);

            const isVerified = await jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, (err, res) => {
                if (err) {
                    return "token expired";
                }
                return res;
            });
            if (isVerified === "token expired") {
                console.log('error in authMiddleware')
                return res.status(401).json({ message: 'token expired. please login again' });
            } else {
                console.log('token verify');
                const userData = await userModel.findOne({ email: isVerified.email }).select({
                    password: 0,
                });
                console.log(userData);

                req.user = userData;
                req.token = token;
                req.userID = userData._id;
                req.isOwnUser = isVerified?.userID === req?.params?.id;
                next();

            }
        } else {
            return res.status(401).json({ message: 'unauthorized user token not provided' });
        }
    } catch (error) {
        console.log('error', error)
    }
}

export default authMiddleWare;