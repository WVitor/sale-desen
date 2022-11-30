const jwt = require('jsonwebtoken')
exports.tokenValidation = async (req, res, next) =>{
    try {
        const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]
        if(token){
            jwt.verify(token, process.env.SECRET, (err, decoded) => {
                if(err) { return res.status(400).json({error: 'token não autorizado'}) }
                else{ next() }
            })
        }else{
            return res.status(400).json({error: 'não autorizado'})
        } 
    } catch (error) {
        console.log(error)
    }

}

exports.checkAuth = async (req, res, next) =>{
    try {   
        jwt.verify(req.session['token'], process.env.SECRET, (err, decoded) => {
            if(err) { 
                req.session.destroy()
                return res.redirect(`/entrar`) 
            }
            else{ return next() }
        })
    } catch (error) {
        console.log(error)
    }

}
exports.notCheckAuth = async (req, res, next) =>{
    try {
        jwt.verify(req.session['token'], process.env.SECRET, (err, decoded) => {
            if(err) { return next() }
            else{ return res.redirect(`/dashboard`) }
        })              
    } catch (error) {
        console.log(error)
    }
} 