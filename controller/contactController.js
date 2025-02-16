const Contact = require('../model/contactModel');


exports.submitForm = (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newContact = new Contact({
    name,
    email,
    subject,
    message,
  });

  newContact.save()
  .then(() => {
    return res.status(200).json({ success: true,message:'Form submitted successfully'});
  })
  .catch((err) => {
    console.error('Error saving contact:', err);
    return res.status(500).json({ error: 'Failed to save contact' });
  });

};

exports.getData = (req, res) => {
  Contact.find({})
    .then((contacts) => {
      return res.status(200).json(contacts);
    })
    .catch((err) => {
      console.error('Error retrieving contacts:', err);
      return res.status(500).json({ error: 'Failed to retrieve contacts' });
    });
};



exports.getMonthlySubmissionCounts = async (req, res) => {
  try {
    const monthlySubmissionCounts = await Contact.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json(monthlySubmissionCounts);
  } catch (err) {
    console.error('Error retrieving monthly submission counts:', err);
    return res.status(500).json({ error: 'Failed to retrieve monthly submission counts' });
  }
};

