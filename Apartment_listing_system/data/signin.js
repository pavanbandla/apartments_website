const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bcrypt = require('bcryptjs');

module.exports = {
    async authenticateUser(email, password) { 

        if(!email || !password) throw "You must provide both username and password"
        const userCollection = await users();
        const user = await userCollection.findOne({ email_id: email });

        if (user) {
            let match = await bcrypt.compare(password, user.password);
            
            if(match) {
                return {user: user};
            }
            else {
                return {error: true, message: "Password is incorrect."};
            }
        }

        return {error: true, message: "User doest not exist."};
    }
}