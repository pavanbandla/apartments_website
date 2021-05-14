const mongoCollections = require('../config/mongoCollections');
const Users = mongoCollections.users;
const Agents = mongoCollections.listingagents;
let { ObjectId, ObjectID } = require('mongodb');
const bcrypt = require('bcryptjs');
const owasp = require('owasp-password-strength-test');

var salt = bcrypt.genSaltSync(9);

module.exports = {

	async getAllUsers() {
		//console.log("We are in GetAllUsers");
		const userCollection = await Users();
		const userList = await userCollection.find({}).toArray();
		if (!userList) throw 'No Users in system!';
		return userList;
	},

	async getUserById(id) {
		const userCollection = await Users();
		let parsedId = ObjectId(id);
		const user = await userCollection.findOne({ _id: parsedId });
		if (!user) throw 'Book Not Found';
		return user;
	},

	async addUser(data) {
		const userCollection = await Users();
		if (await userCollection.findOne({ email_id: data.email_id })) {
			return {flag: false, type: 'exist'}
		} 

		var hash = await bcrypt.hashSync(data.password, salt);
		let newUser = {
			username: data.username,
			email_id: data.email_id,
			password: hash,
			account_type: data.account_type,
			preference: "",
			contact_info: "",
			preferred_location: "",
			profile_picture: ""
		};

		const newInsertInformation = await userCollection.insertOne(newUser);
		if (newInsertInformation.insertedCount === 0) {
			return {flag: false, type: 'failure'}
		};
		
		return {flag: true, inserted_id:newInsertInformation.insertedId};
	},

	async updateProfile(data) {
		let user_id = new ObjectID(data.user_id)

		const userCollection = await Users();
	
		const profile = {
			profile_picture: data.profile_picture,
            username: data.username,
            preference: data.preference,
            contact_info: data.contact_info,
            preferred_location: data.preferred_location
		};
	
		const updateInformation = await userCollection.updateOne({ _id: user_id }, {$set: profile}, { upsert: true });
		if (updateInformation.result.ok !== 1) {
			console.log('Could not add Apartment');
			return {error: true, message: "Could not add Apartment."};
		}
		return true;
	},

	async changePassword(data) {
		let user_id = new ObjectID(data.user_id)

		const userCollection = await Users();

		var hash = await bcrypt.hashSync(data.password, salt);
	
		const newpass = {
			password: hash
		};
	
		const updateInformation = await userCollection.updateOne({ _id: user_id }, {$set: newpass}, { upsert: true });
		if (updateInformation.result.ok !== 1) {
			console.log('Could not add Apartment');
			return {error: true, message: "Could not add Apartment."};
		}
		return true;
	}
};