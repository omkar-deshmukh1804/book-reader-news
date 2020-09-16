const axios = require('axios')
const gTTS = require('gtts');
const express = require('express');
const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
let articles2 = null;
var app = express();

const api_url =
  'http://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=31295da7aabb455e85a9cab94db6f707';

 async function getData() {
  const res = await fetch(api_url);
  const data = await res.json();
  const articles = data.articles; //storing articles from data
  articles2 = data.articles;
  const imgURLS = [];
  const title = [];
   console.log(`This are the arcticles `, articles);
  
     axios
       .put("http://localhost:3000/news/132", {
         article: articles,
       }
       )
     .then(res => {return 0})
     .catch(err => console.error(err));
  
  
  for (let index = 0; index < articles.length; index++) {
    //getting titles from articles array-obj and storing into title array
    const element = articles[index].title;
    title.push(element);
  }
  console.log(title);

  for (let index = 0; index < articles.length; index++) {
    //getting url for images to display in div from articles array-obj and storing into  array
    const element = articles[index].urlToImage;
    imgURLS.push(element);
  }
   console.log(imgURLS);
  
     

  for (let i = 0; i < title.length; i++) {
    // for 10 titles present in array, generating audio file using gtts
    const element = title[i] + '\n' +  articles[i].content;
    var gtts = new gTTS(element, 'en');
    gtts.save(`./title${i + 1}.mp3`, function (err, result) {
      if (err) {
        throw new Error(err);
      }
      console.log('Success!');
    });
   }

  //  for (let i = 0; i < articles.length; i++) {
  //   // for 10 titles present in array, generating audio file using gtts
  //   const element = articles[i].content;
  //   var gtts = new gTTS(element, 'en');
  //   gtts.save(`./content${i + 1}.mp3`, function (err, result) {
  //     if (err) {
  //       throw new Error(err);
  //     }
  //     console.log('Success in generating content audio!');
  //   });
  //  }
}
getData();
setInterval(getData, 36000)

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server running on port ${port} `);
});


