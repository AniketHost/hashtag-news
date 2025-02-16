const userModel = require('../model/userModel');

function trackUserVisit(req, res, next) {
    console.log(req.ip,"bodyyy");
  const ip = req.ip; // Get the user's IP address

  userModel.addVisitor(ip);

  console.log(`User visited: ${ip}`);
  next();
}




function getUniqueVisitorCount(req, res) {
  const count = userModel.getUniqueVisitorCount();
 console.log("uuuuuuuuusssssssssy",{ uniqueVisitors: count });
  res.json({ uniqueVisitors: count });
}

module.exports = {
  trackUserVisit,
  getUniqueVisitorCount,
};
