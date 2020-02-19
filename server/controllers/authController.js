const bcrypt = require('bcryptjs')

module.exports = {
  register: async (req, res) => {
    const { username, password, isAdmin } = req.body
    const db = req.app.get('db')
    let result = await db.get_user([username])
    let exisitngUser = result[0]
    if (exisitngUser) return res.status(409).send('Username Taken')
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    let registerUser = await db.register_user([isAdmin, username, hash])
    let user = registerUser[0]
    req.session.user = {
      isAdmin: user.is_admin,
      id: user.id,
      username: user.username
    }
    res.status(201).send(req.session.user)
  },
  login: async (req, res) => {
    const db = req.app.get('db')
    const { username, password } = req.body
    const foundUser = await db.get_user([username])
    const user = foundUser[0]
    if (!user)
      res
        .send(401)
        .send(
          'User not found. Please register as a new user before logging in.'
        )
    const isAuthenticated = bcrypt.compareSync(password, user.hash)
    if (isAuthenticated) {
      req.session.user = {
        isAdmin: user.is_admin,
        id: user.id,
        username: user.username
      }
      res.status(200).send(req.session.user)
    } else res.status(403).send('incorrect password')
  },
  logout: async (req, res) => {
    req.session.destroy()
    res.sendStatus(200)
  }
}
