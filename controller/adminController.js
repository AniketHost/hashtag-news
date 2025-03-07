
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

require('dotenv').config();

// const analyticsDataClient = new BetaAnalyticsDataClient();


const propertyId = process.env.GA4_PROPERTY_ID;


// No need to pass auth, the library uses GOOGLE_APPLICATION_CREDENTIALS from env
const analyticsDataClient = new BetaAnalyticsDataClient();



exports.websiteViews = async (req, res) => {
    try {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dimensions: [{ name: 'eventName' }],
            metrics: [{ name: 'eventCount' }],
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            dimensionFilter: {
                filter: {
                    fieldName: 'eventName',
                    stringFilter: { value: 'page_view' }
                }
            }
        });

        if (!response.rows || response.rows.length === 0) {
            return res.json({ totalViews: 0 });
        }

        res.json({ totalViews: response.rows[0].metricValues[0].value });

    } catch (error) {
        console.error('Error fetching website views:', error.message);
        res.status(500).json({
            message: 'Failed to fetch website views.',
            error: error.message,  // Optional: You can remove this in production
        });
    }
};


exports.articleViews = async (req, res) => {
    checkMetadata();

    const articleId = req.query.articleId;
    console.log('Fetching views for article:', articleId);

    const [metadata] = await analyticsDataClient.getMetadata({
        name: `properties/${propertyId}/metadata`,
      });
      console.log(metadata.dimensions.map((d) => d.apiName));
      

    try {
        // const [response] = await analyticsDataClient.runReport({
        //     property: `properties/${propertyId}`,
        //     dimensions: [{ name: 'eventName' }],
        //     metrics: [{ name: 'eventCount' }],
        //     dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        //     dimensionFilter: {
        //         filter: {
        //             fieldName: 'eventName',
        //             stringFilter: { value: 'view_article' },
        //         },
        //     },
        // });

        // const [metadata] = await analyticsDataClient.getMetadata({
        //     name: `properties/${propertyId}/metadata`,
        // });

        // const hasArticleId = metadata.dimensions.some(
        //     (dim) => dim.apiName === 'article_id'
        // );

        // if (!hasArticleId) {
        //     console.log('❌ article_id dimension NOT found. Please check GA4 setup.');
        //     return res.status(400).json({
        //         message: 'article_id dimension not found in GA4 metadata.',
        //     });
        // }

        // const [response] = await analyticsDataClient.runReport({
        //     property: `properties/${propertyId}`,
        //     dimensions: [{ name: 'eventName' }, { name: 'article_id' }],
        //     metrics: [{ name: 'eventCount' }],
        //     dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        //     dimensionFilter: {
        //         andGroup: {
        //             expressions: [
        //                 {
        //                     filter: {
        //                         fieldName: 'eventName',
        //                         stringFilter: { value: 'view_article' },
        //                     },
        //                 },
        //                 {
        //                     filter: {
        //                         fieldName: 'article_id',
        //                         stringFilter: { value: articleId },
        //                     },
        //                 },
        //             ],
        //         },
        //     },
        // });

        // console.log(response);


        // const totalViews = response.rows?.[0]?.metricValues?.[0]?.value || 0;

        // res.json({ totalViews });
    } catch (error) {
        console.error('Error fetching article views:', error);
        res.status(500).json({ error: 'Failed to fetch article views' });
    }
};



exports.topActivePages = async (req,res)=> {
    try {
        checkDimension();

        const [response] = await analyticsDataClient.runReport({
          property: `properties/${propertyId}`,
          dimensions: [{ name: 'pagePath' }],
          metrics: [{ name: 'screenPageViews' }],
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          limit: 5,
        });
    
        const topPages = response.rows.map(row => ({
          pagePath: row.dimensionValues[0].value,
          views: row.metricValues[0].value,
        }));
    
        res.status(200).json({ success: true, data: topPages });
      } catch (error) {
        console.error('Error fetching top pages:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch top pages.' });
      }
      
}

const checkMetadata = async () => {
    const [metadata] = await analyticsDataClient.getMetadata({
      name: `properties/${propertyId}/metadata`,
    });
    
    const dimensions = metadata.dimensions.map(d => d.apiName);
    
    if (dimensions.includes('article_id')) {
      console.log('✅ article_id is now available in the API!');
    } else {
      console.log('❌ Still waiting for article_id...');
    }
  };
  
  setInterval(checkMetadata, 1000 * 60 * 60); // Check every hour
  