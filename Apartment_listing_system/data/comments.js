const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
let { ObjectId, ObjectID } = require('mongodb');

const addComment = async(data) => {
    if(!data.user_id || !data.comment) {
        console.log(`Data is undefined in addComment`);
        return false;
    }

    const commentCollection = await comments();
    const newComment = {
        comment_id:	new ObjectId(),
        user_id: new ObjectID(data.user_id),
        review_id: new ObjectID(data.review_id),
        comment: data.comment
    };
    
    const newInsertInformation = await commentCollection.insertOne(newComment);
    if (newInsertInformation.insertedCount === 0) {
        return {error: true, message: "Could not add Comment."};
    }
    else {
        return {new_id: newComment.comment_id }; ;
    }
};

const getCommentByReviewId = async(review_id) => {
    const commentCollection = await comments();
    let parsedId = ObjectId(review_id);
    const comment = await commentCollection.find({ review_id: parsedId }).toArray();
    if (!comment) throw 'Comment Not Found';
    return comment;
};

module.exports = {
    addComment,
    getCommentByReviewId
};
