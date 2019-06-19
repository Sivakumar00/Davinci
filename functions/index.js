const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const pdf = require('html-pdf');
const admin = require('firebase-admin');
admin.initializeApp();
const nodemailer = require("nodemailer");

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/pdf', (req, res, next) => {
    var result = '';
    try {
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
            pdf.create(item, options).toBuffer(function (err, buffer) {
                if (err) return console.log(err);
                //stream.pipe(res)
                //res.send(PDF);
                sendEmail(req.body.email, req.body.subject, buffer);

            });
        } else {
            res.send({ error: 'bad request' })
        }

    } catch (err) {
        console.error("ERROR " + err);
    }

    sendEmail = (email, subject, buffer) => {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'davincivbi@gmail.com',
                pass: 'Davinci@123'
            }
        });
        transporter.sendMail({
            from: 'davincivbi@gmail.com',
            to: email,
            subject: subject,
            text: "Hi,\n Don't reply for this mail.",
            attachments: [{
                filename: subject + '.pdf',
                content: new Buffer(buffer, 'utf-8')
            }]
        }, function (err, info) {
            if (err) {
                res.send(err)
            } else {
                console.log(info);
                res.send(info)
            }
        })


    }

    // storage.bucket(bucket).upload(resp.filename, {
    //     gzip: true,
    //     metadata: {
    //         cacheControl: 'public, max-age=31536000',
    //     },
    // }).then((data) => {


    // console.log(data)
    // console.log(`${resp.filename} uploaded to ${bucket}.`);
    // const file = storage.bucket(bucket).file(targetName);
    // return file.getSignedUrl({
    //     action: 'read',
    //     expires: '03-09-2491'
    // }).then(signedUrls => {
    //     // signedUrls[0] contains the file's public URL
    //     console.log("signed url " + signedUrls[0].replace('storage.googleapis.com', 'storage.cloud.google.com'));
    //     result = '' + signedUrls[0].replace('storage.googleapis.com', 'storage.cloud.google.com')
    //     res.send({ result, html: item })

    // });

    //  });



    // res.status(200).json({ html: item });
});

// Expose Express API as a single Cloud Function:
exports.widgets = functions.https.onRequest(app);
