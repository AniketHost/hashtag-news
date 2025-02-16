const Article = require('../model/article');


exports.detailArticleById = async (req, res) => {
    console.log(req.params.id);
  
    const articleId = req.params.id;
  
    try {
      const article = await Article.findOne({ _id: articleId });
  
      if (article) {
        console.log(article, "pppp");
        res.json(article);
      } else {
        res.status(404).json({ message: 'Article not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };  