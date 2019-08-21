/* eslint-disable promise/catch-or-return */
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const pdf = require("html-pdf");
const admin = require("firebase-admin");
var http = require("http");
admin.initializeApp();
const nodemailer = require("nodemailer");

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/pdf", (req, res, next) => {

  sendEmail = (email, subject, attachment) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "davincivbi@gmail.com",
        pass: "Davinci@123"
      }
    });
    var attach = [];
    let nameArr = req.body.name;
    attachment.map((attachment,index)=>{
        temp={};
        temp['filename']=nameArr[index]+'.pdf';
        temp['content']=attachment;
        attach.push(temp);
    })
    console.log(JSON.stringify(attach))
    var config = {
      from: "davincivbi@gmail.com",
      to: email,
      subject: subject,
      text: "Hi,\n Don't reply for this mail.",
      attachments: attach
    };

    console.log(JSON.stringify(config));
    if (config.attachments.length > 1) {
      transporter.sendMail(config, function(err, info) {
        if (err) {
          res.send(err);
        } else {
          console.log(info);
          res.send(info);
        }
      });
    } else {
      console.log("no attachments");
    }
  };
  getAttachment = item => {
    var attachment = [];
    // eslint-disable-next-line promise/always-return
    convertHtmlToPdf(item).then((attachment) => {
        console.log("then block")
        sendEmail(req.body.email,req.body.subject,attachment);
    }).catch((err)=>{
        console.log("ERROR "+JSON.stringify(err));
    })
    return attachment;
  };

  convertHtmlToPdf = (item,options) => {
    return new Promise(function(resolve, reject) {
        pdf.create(item, options).toBuffer((err, buffer) => {
          if (err) reject(err);
          resolve(buffer )
        });
    });
  };
  try {
    var item = req.body.html;
    if (item !== null || item !== "") {
      var options = {
        format: "Letter",
        border: {
          top: "2cm",
          right: "1cm",
          bottom: "2cm",
          left: "1.5cm"
        }
      };
      var bufferArray = [];
      var nameArray = req.body.name;
      var count = 0;

      // for(var obj of item){
      let res = item.map((obj) => convertHtmlToPdf(obj,options))
      
      Promise.all(res).then((attachment)=>sendEmail(req.body.email,req.body.subject,attachment))
      
    } else {
      res.send({ error: "bad request" });
    }
  } catch (err) {
    res.send({error:"err"});
  }
});

// Expose Express API as a single Cloud Function:
exports.widgets = functions.https.onRequest(app);
