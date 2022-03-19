function guest(req,res,next){
    if(!req.isAuthenticated()){
       return next()
    }

    return res.redirect('/');

   console.log(req.isAuthenticated())
}

module.exports=guest