const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const pdf = require('html-pdf');
var fs = require('fs');



// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/pdf', (req, res, next) => {
    var item = req.body.html;
    if (item !== null || item !== '') {
        var options = { 
            format: 'Letter',
            border: {
                top: "2cm",           
                right: "1cm",
                bottom: "2cm",
                left: "1.5cm"
              },
            
     };
        pdf.create(item, options).toFile('./temp.pdf', function (err, resp) {
            if (err) return console.log(err);
            console.log(resp); 
            res.send(resp)
        });

    }else{
        res.send({error:'bad request'})
    }
   // res.status(200).json({ html: item });
});

// Expose Express API as a single Cloud Function:
exports.widgets = functions.https.onRequest(app);
