const router = require('express').Router();
const { addComment, removeComment } = require('../../controllers/comment-controller');

// POST add comment to /api/comments/:pizzaId
router
    .route('/:pizzaId')
    .post(addComment);

// DELETE comment to /api/comments/:pizzaId/:commentId
router
    .route('/:pizzaId/:commentId')
    .delete(removeComment);

module.exports = router;