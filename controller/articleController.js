const Article = require('../model/article');
const Weather = require('../model/weatherArticle');
const newSportsArticle = require('../model/article');
const newPoliticsArticle = require('../model/article');
const webPush = require('web-push');

const subscriptions = [];

// Configure web push with your VAPID keys
const vapidKeys = {
  publicKey: 'BFsVH8U8RZuSbVbs-ZyN0O54QyZ289Puh--YVqDkGxOxyYl3YFwLCojNiac667mQRDLxQrjChFep_22XlVdPo8w',
  privateKey: '9SsV-PVaIHzauUegARTfEZS4_aesLko9Szw6vhZ0ogM'
};


// webPush.setVapidDetails(
//   'mailto: <aniketgurav2442@gmail.com>',
//   vapidKeys.publicKey,
//   vapidKeys.privateKey
// );

//  exports.subscribe = (req, res) => {
//   console.log("---------");
//   const subscription = req.body.subscription;
//   // Store the subscription
//   subscriptions.push(subscription);
//   console.log('Received subscription:', subscription);
//   res.status(200).send({ success: true });
// };

// exports.sendNotification = (req, res) => {

//   console.log(subscriptions,"[[[[[[[[[[[[[[[[");
//   // const { subscription, payload } = req.body;

//   const subscription = req.body.subscription
//   const payload = req.body.payload


//   // Send notifications to all subscribers
//   Promise.all(
//     subscriptions.map((sub) =>
//       webPush.sendNotification(sub, JSON.stringify(payload))
//     )
//   )
//     .then(() => {
//       console.log('Notifications sent successfully');
//       res.status(200).send({ success: true });
//     })
//     .catch((error) => {
//       console.error('Error sending notifications:', error);
//       res.status(500).send({ success: false, error: 'Error sending notifications' });
//     });
// };

exports.addArticle = async (req, res) => {
  try {
    const { article, headline, img, category } = req.body;

    // Create a new article with the image path and other details
    const newArticle = new Article({
      img,
      article,
      headline,
      category,
    });

    // Save the article to the database
    await newArticle.save();

    // Get tokens of users who accepted notifications (assuming you have a mechanism to store and retrieve tokens)
    // const tokens = ['token1', 'token2', /* ... */];

    // Send notification to users
    // const message = {
    //   data: {
    //     title: 'New Article',
    //     body: `Check out the latest article: ${headline}`,
    //   },
    //   tokens: tokens,
    // };

    // Send notifications using FCM
    // const response = await admin.messaging().sendMulticast(message);
    // console.log('Successfully sent message to devices:', response.successCount);

    res.status(201).json({ message: 'Article created successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// exports.getArticles = async (req, res) => {
//   try {
//     const page = req.query.page || 1; // Get the requested page number from the query parameters
//     const itemsPerPage = 10; // Define the number of items to return per page
//     const topItemsCount = 4; // Define the number of items to include in the top results

//     const skip = (page - 1) * itemsPerPage;

//     // Retrieve articles with sorting and pagination
//     const allArticles = await Article.find()
//       .sort({ date: -1 }) // Sort by date in descending order
//       .skip(skip) // Skip the specified number of items
//       .limit(itemsPerPage); // Limit the number of items per page

//     // Split the results into top and other articles
//     const topArticles = allArticles.slice(0, topItemsCount);
//     const otherArticles = allArticles.slice(topItemsCount);

//     res.status(200).json({ topArticles, otherArticles });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const admin = require('firebase-admin');
// const serviceaccout = require('../helper/abvnewsapp-firebase-adminsdk-h98dv-f20e9a2c69.json')

// admin.initializeApp({
//   credential: admin.credential.cert(serviceaccout),
// databaseURL:'https://abvnewsapp.firebaseio.com'
// });

const registrationToken = ''
exports.getArticles = async (req, res) => {
  // console.log(req.body,"uhuh");

  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = 10; // Number of articles to send per page

    // Calculate the skip value based on the page number and page size
    const skip = (page - 1) * pageSize;

    // Query the database to get a subset of articles based on pagination parameters
    const articles = await Article.find().skip(skip).limit(pageSize).sort({ date: -1 }) // Sort by date in descending order
    ;

    res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getArticleByCategory = async (req, res) => {
  try {
    const { myCategory } = req.body;
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const pageSize = 8; // Number of articles to send per page

    // Calculate the skip value based on the page number and page size
    const skip = (page - 1) * pageSize;


    const articles = await Article.find({ category: myCategory }).skip(skip).limit(pageSize).sort({ date: -1 });

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateArticle = async (req, res) => {
  const id = req.params.id;
  const updatedArticle = req.body;

  try {
    // Update the article in the database using Mongoose
    const result = await Article.findByIdAndUpdate(id, updatedArticle, { new: true });

    if (!result) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ message: 'Article updated successfully', updatedArticle: result });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteArticle = async (req, res) => {
  const id = req.params.id;

  try {
    // Delete the article in the database using Mongoose
    const result = await Article.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


