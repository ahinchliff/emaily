const mongoose = require('mongoose');
const Survey = mongoose.model('surveys');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');


module.exports = app => {
  app.post('/api/surveys', requireLogin, requireCredits, (req, res) => {
    const { title, subject, body } = req.body;
    const recipients = req.body.recipients.split(',').map(email => email.trim());

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.map(email => ({ email })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    const mailer = new Mailer(title, subject, recipients, 'noreply@emaily.com', surveyTemplate(body));
    mailer.send();
  });
};