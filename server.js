const express = require('express');
const app = express();

const axios = require('axios');
const port = 3000;

app.get('/routes-summary', async (req, res) => {
  try {
    // Fetch data from the API
    const response = await axios.get('https://www.goodservice.io/api/routes');
    const routes = response.data.routes;

    // Initialize counters and arrays
    const statusCounts = {};
    const notGoodRoutes = [];

    // Process the routes data
    Object.values(routes).forEach(route => {
      // Count statuses
      statusCounts[route.status] = (statusCounts[route.status] || 0) + 1;

      // Collect routes not in good service
      if (route.status !== 'Good Service' && route.visible) {
        notGoodRoutes.push({
          name: route.name,
          status: route.status
        });
      }
    });

    // Prepare the summary as HTML info cards
    let htmlSummary = '<div id="summary">';
    htmlSummary += `<div><strong>Total Routes:</strong> ${Object.keys(routes).length}</div>`;
    htmlSummary += '<div><strong>Status Counts:</strong><ul>';
    for (const [status, count] of Object.entries(statusCounts)) {
      htmlSummary += `<li>${status}: ${count}</li>`;
    }
    htmlSummary += '</ul></div>';
    htmlSummary += '<div><strong>Not Good Routes:</strong><ul>';
    notGoodRoutes.forEach(route => {
      htmlSummary += `<li>${route.name} - ${route.status}</li>`;
    });
    htmlSummary += '</ul></div>';
    htmlSummary += '</div>';

    res.send(htmlSummary);
  } catch (error) {
    console.error('Error fetching or processing data:', error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
});


function indexHandler(req, res) {
  res.send('Hey everyone, here\'s a poem I wrote for you: !');
}

app.get('/', indexHandler)

app.get('/emailandrew', (req, res) => {
  const nodemailer = require('nodemailer');

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aroberts0417@gmail.com', // replace with your email
      pass: 'mypassword' // replace with your password
    }
  });

  let mailOptions = {
    from: 'aroberts0417@gmail.com', // replace with your email
    to: 'ajroberts0417@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent successfully');
    }
  });
  res.send('Hey, I\'m Andrew, and this is my email address: andrew@example.com');
})


app.listen(3000, () => {
  console.log('Example app listening on port 3000, http://localhost:3000!');
});