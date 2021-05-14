const mongoCollections = require('../config/mongoCollections');
const apartmentlistings = mongoCollections.apartmentlistings;
let { ObjectId } = require('mongodb');

let exportedMethods = {
  async getAllReviews(apartment_id) {
    if (!apartment_id) throw 'ReferenceError: You must provide an id to search for';
    if (typeof(apartment_id) != 'string' || apartment_id.trim() == '') throw TypeError;
    
    let parsedId;
    try {
      parsedId = ObjectId(apartment_id); 
    } catch (error) {
      throw SyntaxError;
    }
    const apartmentCollection = await apartmentlistings();
    const apartment = await apartmentCollection.findOne({_id:parsedId}, {'reviews' : 1});
    if (!apartment || apartment.reviews.length==0) throw 'No reviews in system!';
    return apartment.reviews;     
  },
  // This is a fun new syntax that was brought forth in ES6, where we can define
  // methods on an object with this shorthand!
  async getReviewById(id) {
    if (!id) throw 'ReferenceError: You must provide an id to search for';
    if (typeof(id) != 'string' || id.trim() == '') throw TypeError;
    
    let parsedId;
    try {
      parsedId = ObjectId(id); 
    } catch (error) {
      throw SyntaxError;
    }
    const apartmentCollection = await apartmentlistings();
    
    const apartment = await apartmentCollection.findOne({ reviews: { $elemMatch: { _id: parsedId } } }, {'reviews': 1});
    if(!apartment) throw 'Review not found';
    let review = null;
    apartment.reviews.forEach(element => {
      if(String(element._id) == id)
      {
        review = element;
        return;
      }
    });

    if (!review) throw 'Review not found';
    return review;
  },
  async addReview(data) {
    if (!data.apartment_id || !data.user_id) {
      console.log('Data is undefined while addReview');
      return false;
    }
    
    let parsedId;
    try {
      parsedId = ObjectId(data.apartment_id); 
    } catch (error) {
      console.log('Invalid apartment list id while addReview');
      return false;
    }

    const apartmentCollection = await apartmentlistings();

    let apartment = await apartmentCollection.findOne({ listing_id : parsedId });

    if (!apartment) {
      console.log('Apartment list is not exist whil addReview');
      return false;
    }

    let newReview = {
      review_id: new ObjectId(),
      user_id: data.user_id,
      review: data.review,
      rating: data.rating
    };

    apartment.reviews.push(newReview);

    const updateInfo = await apartmentCollection.updateOne(
      { listing_id: parsedId },
      { $set: apartment } );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
      console.log('Update failed');
      return false;
    }

    return newReview.review_id;
  },
  async removeReview(id) {
    if (!id) throw 'ReferenceError: You must provide an id to search for';
    if (typeof(id) != 'string' || id.trim() == '') throw TypeError;
    
    let parsedId;
    try {
      parsedId = ObjectId(id); 
    } catch (error) {
      throw SyntaxError;
    }
    const apartmentCollection = await apartmentlistings();
    const apartment = await apartmentCollection.findOne({ 'reviews._id' : parsedId }, {'reviews': 1});
    if(!apartment) throw 'Review not found';
    let review = null;
    let index = -1;
    for(let i=0; i<apartment.reviews.length; i++){
      const element = apartment.reviews[i];
      if(String(element._id) == id)
      {
        index = i;
        break;
      }
    };


    if (index == -1) throw 'Review not found';

    apartment.reviews.splice(index, 1);

    const updateInfo = await apartmentCollection.updateOne(
      { _id: apartment._id },
      { $set: apartment } );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Update failed';
      
    return {"reviewId": id, "deleted": true};
  }
};

module.exports = exportedMethods;
