const Subscription = require('../model/subscription');
const webPush = require('web-push');



exports.subscribe = async (req,res) => {

  console.log(req,"0909090");
  const subscription = req.body;

  try {
    await Subscription.create(subscription);
    console.log(subscription,"---------");
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Error saving subscription to database:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

async function sendNotification(req, res) {
  const payload = JSON.stringify({ title: 'Web Push Notification', body: 'Hello from Node.js!' });

  try {
    const subscriptions = await Subscription.find();

    await Promise.all(subscriptions.map(async (sub) => {
      try {
        await webPush.sendNotification(sub, payload);
      } catch (err) {
        console.error('Error sending notification to a subscriber:', err);
        // Handle the error for this specific subscriber
      }
    }));

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error sending notifications:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}
module.exports = {
  // subscribe,
  sendNotification,
};
