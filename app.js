const express = require('express')
const upload = require('express-fileupload')
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const fs = require("fs");

const app = express();

app.use(upload())
app.use(express.static(__dirname + '/assets'))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.get("/login.html", (req, res) => {
  res.sendFile(__dirname + "/login.html")
})

app.get("/readtest.html", (req, res) => {
  res.sendFile(__dirname + "/readtest.html")
})

app.get("/Form.html", (req, res) => {
  res.sendFile(__dirname + "/Form.html")
})

app.get("/elements.html", (req, res) => {
  res.sendFile(__dirname + "/elements.html")
})

app.get('/test.html', (req, res) => {
  res.sendFile(__dirname + '/test.html')
})


function fromFile(filename) {
  const speechConfig = sdk.SpeechConfig.fromSubscription('f1ffe73fe3c74bdaaad9229af35d6630', 'eastus');
  let audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(__dirname + "/uploads/" + filename));
  let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  speechRecognizer.recognizeOnceAsync(result => {
    switch (result.reason) {
      case sdk.ResultReason.RecognizedSpeech:
        console.log(`RECOGNIZED: Text=${result.text}`);
        return result.text;
        break;
      case sdk.ResultReason.NoMatch:
        console.log("NOMATCH: Speech could not be recognized.");
        break;
      case sdk.ResultReason.Canceled:
        const cancellation = sdk.CancellationDetails.fromResult(result);
        console.log(`CANCELED: Reason=${cancellation.reason}`);

        if (cancellation.reason == sdk.CancellationReason.Error) {
          console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
          console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
          console.log("CANCELED: Did you set the speech resource key and region values?");
        }
        break;
    }
    speechRecognizer.close();
  });
}
// fromFile();




app.post('/test.html', (req, res) => {
  if (req.files) {
    console.log(req.files)
    var file = req.files.file
    var filename = file.name
    console.log(filename)

    file.mv('./uploads/' + filename, async (err) => {
      if (err) {
        res.send(err)
      }
      else {
        // let results = await(fromFile(filename))
        const speechConfig = sdk.SpeechConfig.fromSubscription('f1ffe73fe3c74bdaaad9229af35d6630', 'eastus');
        let audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(__dirname + "/uploads/" + filename));
        let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

        speechRecognizer.recognizeOnceAsync(result => {
          switch (result.reason) {
            case sdk.ResultReason.RecognizedSpeech:
              console.log(`RECOGNIZED: Text=${result.text}`);

              res.send("File Uploaded, text is : " + result.text);
              
              break;
            case sdk.ResultReason.NoMatch:
              console.log("NOMATCH: Speech could not be recognized.");
              break;
            case sdk.ResultReason.Canceled:
              const cancellation = sdk.CancellationDetails.fromResult(result);
              console.log(`CANCELED: Reason=${cancellation.reason}`);

              if (cancellation.reason == sdk.CancellationReason.Error) {
                console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
                console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
                console.log("CANCELED: Did you set the speech resource key and region values?");
              }
              break;
          }
          speechRecognizer.close();
        });


      }
    })
  }
})



app.listen(3000)