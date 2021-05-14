const dbConnection = require('./config/mongoConnection');
const data = require('./data/');
const apartments = data.apartmentlistings;
const comments = data.comments;
const users = data.users;
const reviews = data.reviews;

const commentData = [{
    "comment": "aaaaaaaaaaaaaa"
}];

const userData = [
	{
		"username": "User",
		"email_id": "user@gmail.com",
		"password": "123",
		"account_type": "1",
		"preference": "",
		"contact_info": "",
		"preferred_location": "",
		"profile_picture":""
	},
	{
		"username": "Agent",
		"email_id": "agent@gmail.com",
		"password": "123",
		"account_type": "2",
		"preference": "",
		"contact_info": "",
		"preferred_location": "",
		"profile_picture":""
	}
];

const listData = [
	{
    "title": "Why would one want to query multiple collections simultaneously?",
    "price": "200",
    "utilities_included": 1,
    "address": "New York New York Casino, South Las Vegas Boulevard, Las Vegas, NV, USA",
    "longitude": "-115.1745465",
    "latitude": "36.1023786",
    "description": "Let us consider an application where users can publish their posts(articles). In the beginning, a user needs to create an account and enter all his details. These details can include a user name, email, date of birth, password and other information. We can represent user details as a JSON object and store it as a document in a MongoDB collection. That implies that there must be a collection to keep all the documents of the different users whether he or she has a post or not. We can use Mongoose to create a collection that stores user documents in database.",
    "photos": ["1620680716487.jpg", "1620680712125.jpg"],
	"reviews": [],
	"rating": 4
	},
	{
		"title": "A Get Request for the list of posts",
		"price": "400",
		"utilities_included": 1,
		"address": "Los Angeles, Independencia, Chile, Chile",
		"longitude": "-70.6647679",
		"latitude": "-33.4251392",
		"description": "The get request will query that database and fetch all the posts in the database. The populate method will check the post object and find a property called author that is referencing to another collection ( authors collection). It will go and fetch an author with its id and fill the author’s property in the post object with the respective author from the author’s collection. This may sound confusing but when we are creating a post, we also provide an author ID in the route. This means every post is created with an author. But only the author ID will be stored in the post object. So when a post is being called, the populate method will use this particular ID to identify the author of this post.",
		"photos": ["1620680863092.jpg", "1620680854993.jpg", "1620680851848.jpg"],
		"reviews": [],
		"rating": 5
	},
	{
		"title": "Populate and Exec method",
		"price": "300",
		"utilities_included": 1,
		"address": "San Francisco del Rincón, Guanajuato, Mexico",
		"longitude": "-101.8492577",
		"latitude": "21.0170828",
		"description": "There is another method called exec (line 26). The populate method does not return a promise. This implies that the code below will not be executed. The exec method is added so that the rest of the codes below are executed. The response of the lists of posts can be seen as follows on Postman.",
		"photos": ["1620680909692.jpg", "1620680905408.jpg", "1620680903280.jpg"],
		"reviews": [],
		"rating": 4
	},
	{
		"title": "We need to save the two objects now",
		"price": "400",
		"utilities_included": 1,
		"address": "Mills Street, St. Louis, MO, USA",
		"longitude": "-90.2141008",
		"latitude": "38.6395709",
		"description": "After splicing this particular post, we then go ahead and save the author’s object.We also now need to check if the author provided in the request exists in the database (line 35). If that specific author exists in the database, we will push this post to his array of posts (line 41) and go ahead and save this author object also.",
		"photos": ["1620680985568.jpg", "1620680981858.jpg", "1620680978931.jpg"],
		"reviews": [],
		"rating": 3
	},
	{
		"title": "A Get Request for the list of posts",
		"price": "300",
		"utilities_included": 1,
		"address": "San Jose Way, Sacramento, CA, USA",
		"longitude": "-121.4594216",
		"latitude": "38.5482765",
		"description": "The get request will query that database and fetch all the posts in the database. The populate method will check the post object and find a property called author that is referencing to another collection ( authors collection). It will go and fetch an author with its id and fill the author’s property in the post object with the respective author from the author’s collection. This may sound confusing but when we are creating a post, we also provide an author ID in the route. This means every post is created with an author. But only the author ID will be stored in the post object. So when a post is being called, the populate method will use this particular ID to identify the author of this post.",
		"photos": ["1620688834597.jpg", "1620688831015.jpg", "1620688826906.jpg"],
		"reviews": [],
		"rating": 4
	},
	{
		"title": "Populate and Exec method",
		"price": "500",
		"utilities_included": 1,
		"address": "Ros an Treut, Scaër, France",
		"longitude": "-3.66423",
		"latitude": "47.985535",
		"description": "There is another method called exec (line 26). The populate method does not return a promise. This implies that the code below will not be executed. The exec method is added so that the rest of the codes below are executed. The response of the lists of posts can be seen as follows on Postman.",
		"photos": ["1620688926106.jpg", "1620688920903.jpg", "1620688917363.jpg"],
		"reviews": [],
		"rating": 4
	}
];

const reviewData = [
	{
		"review": "I think this place is very fantastic places.",
		"rating": "5"
	}, {
		"review": "Very interesting place, I wanna live in here",
		"rating": "4"
	}, {
		"review": "This is a very good place to live",
		"rating": "5"
	}, {
		"review": "I think this place is very fantastic places.",
		"rating": "5"
	}, {
		"review": "Very interesting place, I wanna live in here",
		"rating": "5"
	}, {
		"review": "I think this place is very fantastic places.",
		"rating": "5"
	}, {
		"review": "Very interesting place, I wanna live in here",
		"rating": "4"
	}, {
		"review": "Very interesting place, I wanna live in here",
		"rating": "3"
	}, {
		"review": "I think this place is very fantastic places.",
		"rating": "3"
	}, {
		"review": "I think this place is very fantastic places.",
		"rating": "4"
	}, {
		"review": "Very interesting place, I wanna live in here",
		"rating": "4"
	}, {
		"review": "I think this place is very fantastic places.",
		"rating": "4"
	}, {
		"review": "Very interesting place, I wanna live in here",
		"rating": "5"
	}
];

async function main() {
	const db = await dbConnection();
	await db.dropDatabase();

	const user1 = await users.addUser(userData[0]);
	const user2 = await users.addUser(userData[1]);
	console.log(typeof(user2.inserted_id.toString()))
	const apartment1 = await apartments.addApartment({"user_id": user2.inserted_id.toString(), ...listData[0]});
	const apartment2 = await apartments.addApartment({"user_id": user2.inserted_id.toString(), ...listData[1]});
	const apartment3 = await apartments.addApartment({"user_id": user2.inserted_id.toString(), ...listData[2]});
	const apartment4 = await apartments.addApartment({"user_id": user2.inserted_id.toString(), ...listData[3]});
	const apartment5 = await apartments.addApartment({"user_id": user2.inserted_id.toString(), ...listData[4]});
	const apartment6 = await apartments.addApartment({"user_id": user2.inserted_id.toString(), ...listData[5]});
	const review1 = await reviews.addReview({"apartment_id": apartment1.new_id.toString(), "user_id": user1.inserted_id.toString(), ...reviewData[0]});
	const review2 = await reviews.addReview({"apartment_id": apartment1.new_id.toString(), "user_id": user2.inserted_id.toString(), ...reviewData[1]});
	// const review3 = await reviews.addReview({"apartment_id": apartment1.new_id.toString(), "user_id": user1.inserted_id.toString(), ...reviewData[2]});
	const review4 = await reviews.addReview({"apartment_id": apartment2.new_id.toString(), "user_id": user1.inserted_id.toString(), ...reviewData[3]});
	const review5 = await reviews.addReview({"apartment_id": apartment2.new_id.toString(), "user_id": user2.inserted_id.toString(), ...reviewData[4]});
	const review6 = await reviews.addReview({"apartment_id": apartment3.new_id.toString(), "user_id": user1.inserted_id.toString(), ...reviewData[5]});
	const review7 = await reviews.addReview({"apartment_id": apartment3.new_id.toString(), "user_id": user2.inserted_id.toString(), ...reviewData[6]});
	const review8 = await reviews.addReview({"apartment_id": apartment4.new_id.toString(), "user_id": user1.inserted_id.toString(), ...reviewData[7]});
	const review9 = await reviews.addReview({"apartment_id": apartment4.new_id.toString(), "user_id": user2.inserted_id.toString(), ...reviewData[8]});
	const review10 = await reviews.addReview({"apartment_id": apartment5.new_id.toString(), "user_id": user1.inserted_id.toString(), ...reviewData[9]});
	const review11 = await reviews.addReview({"apartment_id": apartment5.new_id.toString(), "user_id": user2.inserted_id.toString(), ...reviewData[10]});
	const review12 = await reviews.addReview({"apartment_id": apartment6.new_id.toString(), "user_id": user1.inserted_id.toString(), ...reviewData[11]});
	const review13 = await reviews.addReview({"apartment_id": apartment6.new_id.toString(), "user_id": user2.inserted_id.toString(), ...reviewData[12]});
	const comment_id = await comments.addComment({"user_id": user2.inserted_id.toString(), "review_id": review1.toString(), ...commentData[0]});

	console.log('Done seeding database');

	await db.serverConfig.close();
}

main();
