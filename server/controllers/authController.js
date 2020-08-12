const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const {username, password, isAdmin} = req.body
        let db = req.app.get('db')
        let result = await db.get_user([username])
        if(result[0]){ // if user is found
            return res.status(409).send('Username taken')
        }
        let salt = bcrypt.genSalt(10);
        let hash = bcrypt.hashSync(password, salt)
        let registeredUser = await db.register_user([isAdmin, username, hash])
        
        req.session.user = { isAdmin: user.is_admin, username: user.username, id: user.id}
        return res.status(201).send(req.session.user)
    },

    login: async (req, res) => {
        const { username, password } = req.body;
        const foundUser = await req.app.get('db').get_user([username])
        const user = foundUser[0]
        if (!user) {
            return res.status(403).send('Incorrect Password')
        }
        req.session.user = { isAdmin: user.is_admin, username: user.username, id: user.id}
        return res.status(201).send(req.session.user)
    }
}