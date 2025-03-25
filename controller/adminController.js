
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const { json } = require('body-parser');

// const analyticsDataClient = new BetaAnalyticsDataClient();
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS), // Parse JSON string
});


const propertyId = '421339925';


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
  try {
    const articleId = req.query.articleId;
    // console.log('🔍 Full Request URL:', req.originalUrl);
    // console.log('Fetching views for article:', articleId);

    if (!articleId) {
      return res.status(400).json({ error: 'Missing articleId' });
    }

    // ✅ Check GA4 schema
    const [metadata] = await analyticsDataClient.getMetadata({
      name: `properties/${propertyId}/metadata`,
    });

    // console.log('Available Dimensions:', metadata.dimensions.map(dim => dim.apiName));

    // ✅ Fetch article views
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dimensions: [{ name: 'customEvent:article_id' }],
      metrics: [{ name: 'eventCount' }],
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensionFilter: {
        filter: {
          fieldName: 'customEvent:article_id',
          stringFilter: { matchType: 'EXACT', value: articleId },
        },
      },
    });

    // console.log('GA4 Response:', JSON.stringify(response, null, 2));s

    // ✅ Extract views count
    const totalViews = response.rows?.[0]?.metricValues?.[0]?.value || 0;
    res.json({ totalViews });

  } catch (error) {
    console.error('❌ Error fetching article views:', error);
    res.status(500).json({ error: 'Failed to fetch article views' });
  }
};








exports.topActivePages = async (req, res) => {
  try {

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

exports.allArticleViews = async (req, res) => {
  try {
    // console.log('🔍 Fetching views for all articles...');

    // ✅ Fetch all article views from GA4
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dimensions: [
        { name: 'customEvent:article_id' },  // Group by article_id
        { name: 'customEvent:article_title' } // Include article_title dimension
      ],
      metrics: [{ name: 'eventCount' }], // Get total views
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    });

    // console.log('GA4 Response:', response);

    // ✅ Process response into a readable format
    const articleViews = response.rows?.map(row => ({
      articleId: row.dimensionValues[0].value,  // Extract article_id
      articleTitle: row.dimensionValues[1].value,  // Extract article_title
      totalViews: parseInt(row.metricValues[0].value, 10),  // Convert event count to number
    })) || [];

    res.json({ articleViews }); // Send JSON response
  } catch (error) {
    console.error('❌ Error fetching article views:', error);
    res.status(500).json({ error: 'Failed to fetch article views' });
  }
};
