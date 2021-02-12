const router = require('express').Router();
const { addComment, removeComment, addReply, removeReply } = require('../../controllers/comment-controller');

// POST add comment to /api/comments/:pizzaId
router
    .route('/:pizzaId')
    .post(addComment);

// DELETE comment, PUT reply to /api/comments/:pizzaId/:commentId 
router
    .route('/:pizzaId/:commentId')
    .put(addReply)
    .delete(removeComment);

// DELETE reply with id of individual reply
router
    .route('/:pizzaId/:commentId/:replyId')
    .delete(removeReply);

module.exports = router;