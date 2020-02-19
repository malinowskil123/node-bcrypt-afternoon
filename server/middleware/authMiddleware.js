module.exports = {
  usersOnly: (req, res, next) => {
    // return VVVVV!!!
    if (!req.session.user) return res.status(401).send('Please Log in')
    next()
  },
  adminsOnly: (req, res, next) => {
    let { isAdmin } = req.session.user
    if (!isAdmin) return res.status(403).send("You're not a admin")
    next()
  }
}
