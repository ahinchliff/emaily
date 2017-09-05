const keys = require('../../config/keys');

module.exports = (content) => {
  return `
    <html>
      <body>
        <div style="text-align: center;">
          <h3>I'd like your input!</h3>
          <p>Please answer the following question:</p>
          <p>${content.body}</p>
          <div>
            <a href="${keys.redirectDomain}/api/surveys/${content.surveyId}/yes">Yes</a>
          </div>
          <div>
            <a href="${keys.redirectDomain}/api/surveys/${content.surveyId}/no">No</a>
          </div>
        </div>
      </body>
    </html>
  `;
};