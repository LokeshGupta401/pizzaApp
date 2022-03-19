const User = require("../../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

function authController() {
  return {
    login(req, res) {
      res.render("auth/login");
    },
    logout(req, res){

      req.logout();
      res.redirect("/login");

    },
    postLogin(req,res,next){
      console.log("inside login")
    passport.authenticate('local',(err,user,info)=>{
      if(err){
        req.flash('error',info.message)
        return next(err)
      }

      if(!user){
        req.flash('error',info.message)
        return res.redirect('/login')

      }

      req.logIn(user,(err)=>{
        if(err){
          req.flash('error',info.message)
          return next(err)
          }

          return res.redirect('/')

      })
    })(req,res,next)
    },
    register(req, res) {
      res.render("auth/register");
    },
    async postRegister(req, res) {
      const { name, email, password } = req.body;

      User.exists({ email: email }, (err, result) => {
        if (result) {
          req.flash("error", "Email Already Taken");
          req.flash("name", name);
          req.flash("email", email);
          return res.redirect("/register");
        }
      });

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        name,
        email,
        password: hashedPassword,
      });

      user.save().then((user)=>{
        return res.redirect("/");
      }).catch(err=>{
        req.flash("error", "Somthing went wrond");
        return res.redirect("/register");
      
      });
    },
  };
}

module.exports = authController;
