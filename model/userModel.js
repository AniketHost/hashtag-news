class UserModel {
    constructor() {
      this.uniqueVisitors = new Set();
    }
  
    addVisitor(ip) {
      this.uniqueVisitors.add(ip);
      console.log(ip,"MYYYYYYYYYYIIIIIIIIIIIPPPPPPPPPP");
    }
  
    getUniqueVisitorCount() {
      return this.uniqueVisitors.size;
    }
  }
  
  module.exports = new UserModel();
   