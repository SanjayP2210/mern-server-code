// create token and add into the cookies
export const sendToken = (user, res, statusCode, message) => {
    const token = user.generateToken();
    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 60 * 60 * 1000),
        secure: false, sameSite: 'lax'
    };
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token,
        user,
        message
    })
}