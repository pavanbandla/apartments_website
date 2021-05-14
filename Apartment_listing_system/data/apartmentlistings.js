const mongoCollections = require('../config/mongoCollections');
const apartmentlistings = mongoCollections.apartmentlistings;

const { getUserById } = require('./users');
const { getCommentByReviewId } = require('./comments');

let { ObjectId, ObjectID } = require('mongodb');
const { all } = require('../routes/home');

const fs = require('fs');

const addApartment = async(data) => {
    if(!data.title || !data.price || !data.address) {
        console.log(`Data is undefined in addApartment`);
        return {error: true, message: "Data is undefined in addApartment."};
    }

    const apartmentCollection = await apartmentlistings();
    const newApartment = {
        listing_id: new ObjectId(),
        user_id: new ObjectID(data.user_id),
        title: data.title,
        price: data.price,
        utilities_included: data.utilities_included,
        address: data.address,
        longitude: data.longitude,
        latitude: data.latitude,
        description: data.description,
        photos: data.photos,
        reviews: [],
        rating: data.rating ? data.rating : 0
    };
    
    const newInsertInformation = await apartmentCollection.insertOne(newApartment);
    if (newInsertInformation.insertedCount === 0) {
        console.log('Could not add Apartment');
        return {error: true, message: "Could not add Apartment."};
    }
    return {new_id: newApartment.listing_id};
}

const updateApartment = async(data) => {
    let new_listing_id = new ObjectID(data.listing_id)

    const apartmentCollection = await apartmentlistings();

    const newApartment = {
        user_id: new ObjectID(data.user_id),
        title: data.title,
        price: data.price,
        utilities_included: data.utilities_included,
        address: data.address,
        longitude: data.longitude,
        latitude: data.latitude,
        description: data.description,
        photos: data.photos
    };

    const updateInformation = await apartmentCollection.updateOne({ listing_id: new_listing_id }, {$set: newApartment}, { upsert: true });
    if (updateInformation.result.ok !== 1) {
        console.log('Could not add Apartment');
        return {error: true, message: "Could not add Apartment."};
    }
    return true;
}

const addReview = async(data) => {
    let new_listing_id = new ObjectID(data.listing_id)

    const apartmentCollection = await apartmentlistings();
    const exist_apartment = await apartmentCollection.findOne({ listing_id: new_listing_id });
    let exist_reviews = exist_apartment.reviews;
    
    const newReview = {
        review_id: new ObjectID(),
        user_id: new ObjectID(data.user_id),
        review: data.review_text,
        rating: data.review_score
    };

    exist_reviews.push(newReview);

    let total_rate = 0;
    for(each of exist_reviews) {
        total_rate += parseInt(each.rating);
    }

    let length = exist_reviews.length;

    const update_data = {
        reviews: exist_reviews,
        rating: length? Math.floor(total_rate/length): 0
    };

    const updateInformation = await apartmentCollection.updateOne({ listing_id: new_listing_id }, {$set: update_data}, { upsert: true });
    if (updateInformation.result.ok !== 1) {
        console.log('Could not add Review.');
        return {error: true, message: "Could not add Review."};
    }
    return true;
}

const getAllApartments = async() => {
    try {
        const apartmentCollection = await apartmentlistings();
        
        let allapartments = await apartmentCollection.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: "$user"
            }
        ]).toArray();

        console.log(allapartments)

        if(allapartments) {
            return { flag: true, allapartments: allapartments};
        }
        else {
            return { flag: false, error: "Could not find records"};
        }

    } catch(e) {
        console.log(`Error while getNextRaceInfo: ${e.message}`);
        return { result: false, error: e.message};
    }
}

const searchApartments = async(filter) => {
    try {
        const apartmentCollection = await apartmentlistings();

        let all_agg = [];
        let filter_agg = [];

        console.log(filter);

        if(filter.term) {
            filter_agg.push({title: {$regex: filter.term}})
            filter_agg.push({description: {$regex: filter.term}})
        }

        if(filter.min_price) {
            filter_agg.push({price: {$gt: filter.min_price}})
        }

        if(filter.max_price) {
            filter_agg.push({price: {$lt: filter.max_price}})
        }

        if(filter.rating && filter.rating != '0') {
            filter_agg.push({rating: {$gt: parseInt(filter.rating)}})
        }

        if(filter_agg.length != 0) {
            all_agg.push({
                $match: {
                    $or: filter_agg
                }
            });
        }

        all_agg.push({
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            }
        });

        all_agg.push({
            $unwind: "$user"
        });

        let totalapartment = await apartmentCollection.aggregate(all_agg).toArray()
        let total_count = totalapartment.length;

        let current_page = 1;
        if(filter.page && filter_agg.length == 0) {
            all_agg.push({ 
                $skip: 5 * (filter.page - 1)
            });
            current_page = filter.page;
        }
        
        all_agg.push({
            $limit: 5
        });

        let searchapartments = await apartmentCollection.aggregate(all_agg).toArray();
        console.log(searchapartments);
        
        if(searchapartments) {
            return { flag: true, searchapartments: searchapartments, total_count: total_count, current_page: current_page};
        }
        else {
            return { flag: false, err: "Could not find records"};
        }

    } catch(e) {
        console.log(`Error while getNextRaceInfo: ${e.message}`);
        return { result: false, error: e.message};
    }
}

const getApartmentByID = async(listing_id) => {
    try {
        let new_listing_id = new ObjectID(listing_id)
        const apartmentCollection = await apartmentlistings();
        const apartment = await apartmentCollection.findOne({ listing_id: new_listing_id });
        if(apartment) {
            return { flag: true, apartment: apartment};
        }
        else {
            return { flag: false, message: "Could not find the record"};
        }
    } catch(e) {
        console.log(`Error while getNextRaceInfo: ${e.message}`);
        return { flag: false, message: e.message};
    }
}

const getApartmentDetailByID = async(listing_id) => {
    try {
        var new_listing_id = new ObjectID(listing_id)
        const apartmentCollection = await apartmentlistings();
        
        let apartment = await apartmentCollection.aggregate([
            { 
                $match: {
                    $and: [{
                        listing_id: new_listing_id
                    }]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: "$user"
            }
        ]).toArray();

        let reviews = apartment[0].reviews;
        if(reviews) {
            for ( each of reviews) {
                let user = await getUserById(new ObjectID(each.user_id));
                each['username'] =  user.username;
                
                let comment = await getCommentByReviewId(new ObjectID(each.review_id));
                if(comment) {
                    for (com of comment) {
                        let com_user = await getUserById(new ObjectID(com.user_id));
                        com['username'] =  com_user.username;
                    }
                    each['comment'] = comment;
                }
            }
        }

        console.log(apartment[0]);

        if(apartment) {
            return { flag: true, apartment: apartment[0]};
        }
        else {
            return { flag: false, message: "Could not find the record"};
        }
    } catch(e) {
        console.log(`Error while getNextRaceInfo: ${e.message}`);
        return { flag: false, message: e.message};
    }
}

const deleteApartmentByID = async(listing_id) => {
    try {
        let new_listing_id = new ObjectID(listing_id)
        const apartmentCollection = await apartmentlistings();

        const exist_record = await apartmentCollection.findOne({ listing_id: new_listing_id });
        let photos = exist_record.photos;
        
        photos.map((each) => {
            fs.unlink('./public/uploads/' + each, (err, files) => {
                if(err) 
                {
                    console.error(`Error occured while delete files ${err}`);
                    return;
                }
                else {
                    console.log('Delete success.');
                }
            });
        });

        if(await apartmentCollection.deleteOne({ listing_id: new_listing_id })){
            return { flag: true};
        }
        else {
            return { flag: false, message: "Delete Failure"};
        }
    } catch(e) {
        console.log(`Error while getNextRaceInfo: ${e.message}`);
        return { flag: false, message: e.message};
    }
}

const updatePhoto = async(data) => {
    let new_listing_id = new ObjectID(data.listing_id)

    const apartmentCollection = await apartmentlistings();

    let existRecord = await getApartmentByID(new_listing_id);
    let existPhoto = existRecord.apartment.photos

    let pos = existPhoto.indexOf(data.file);
    console.log(pos)
    
    if(pos > -1) {
        existPhoto.splice(pos, 1);
    }

    const newApartment = {
        photos: existPhoto
    };

    const updateInformation = await apartmentCollection.updateOne({ listing_id: new_listing_id }, {$set: newApartment}, { upsert: true });
    if (updateInformation.result.ok !== 1) {
        console.log('Could not add Apartment');
        return {error: true, message: "Could not add Apartment."};
    }
    return true;
}

module.exports = {
    addApartment,
    getAllApartments,
    getApartmentByID,
    deleteApartmentByID,
    updateApartment,
    getApartmentDetailByID,
    addReview,
    searchApartments,
    updatePhoto
};