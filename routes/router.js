const express = require('express');
const router = express.Router();
const contactController = require('../controller/contactController');
const loginController = require('../controller/loginController')
const articleController = require('../controller/articleController');
const detailArticle = require('../controller/detail-article');

const subscriptionController = require('../controller/subscription.controller');

const adminController = require('../controller/adminController')


const userImage = require('../controller/user-image')

// const userController = require('../controller/userController')

// Define the route for form submission
router.post('/contact', contactController.submitForm);

router.post('/login', loginController.loginUser);

router.post('/verifyOTP', loginController.verifyOTP);

router.post('/getArticleByCategory', articleController.getArticleByCategory);

router.post('/register', loginController.registerUser);
router.post('/addArticle', articleController.addArticle);

// router.post('/subscribe', subscriptionController.subscribe);
router.post('/send-notification', subscriptionController.sendNotification);


// router.post('/subscribe', articleController.subscribe);
// router.post('/send-notification', articleController.sendNotification);

router.get('/getArticles', articleController.getArticles);
router.get('/detail/:id', detailArticle.detailArticleById);

router.get('/check-cookies-token', async function (req, res, next) {
    loginController.checkcookiestoken(req, res)
})

router.get('/removeCookie', async function (req, res, next) {
    loginController.removeCookie(req, res)
})

router.post('/get-refresh-token', async function (req, res, next) {
    loginController.getrefreshtoken(req, res)
})

router.put('/update/:id', articleController.updateArticle)



router.get('/allContact', contactController.getData);

router.delete('/articles/:id', articleController.deleteArticle);




router.get('/website-views', async function (req, res, next) {
    adminController.websiteViews(req, res)
})



router.get('/article-views', async function (req, res, next) {
    console.log("✅ /article-views route hit");
    adminController.articleViews(req, res);
});

router.get('/topActivePages', async function (req, res, next) {
    console.log("✅ /topActivePages route hit");
    adminController.topActivePages(req, res);
});


router.get('/allArticleViews', async function (req, res, next) {
    console.log("✅ /allArticleViews route hit");
    adminController.allArticleViews(req, res);
});




// router.get('/getDataMonth', contactController.getMonthlySubmissionCounts);

// router.get('/count', userController.getUniqueVisitorCount);

// router.get('/ip', userController.trackUserVisit);

// router.post('/UploadImageInServer', userImage.uploadImageInServer);



module.exports = router;