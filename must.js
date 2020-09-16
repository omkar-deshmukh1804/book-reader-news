

axios
  .get("http://localhost:3000/news")
    .then(res => {
      console.log(`Response `, res.data[0].article);
      for (let x = 0; x < res.data[0].article.length; x++) {
        var board = document.createElement('div');
        board.className = "col-12 card-col";
        document.getElementById('cards-row').appendChild(board);
        var a = document.createElement('audio')
        a.id = `newsContent${res.data[0].article[x].publishedAt}`
        a.src = `/content${x+1}.mp3`
        document.getElementById("audioplace").appendChild(a);
        var b = document.createElement('audio')
        b.id = `newsTitle${res.data[0].article[x].publishedAt}`
        b.src = `/title${x+1}.mp3`
        document.getElementById("audioplace").appendChild(b);
        
      }
        for (let i = 0; i < res.data[0].article.length; i++)
            {
                
    var html ='' + 
            '' + '<div class="card mb-3">' +
            '<div class="card-body bg-success">'+
            '<img src={{urlToImage}} class="card-img-top" alt="default"  style="width : 25%; float : left" />' +
            `<div class="card-title text-light" id="newsTitle{{publishedAt}}" onmouseover="document.getElementById('newsTitle{{publishedAt}}').play();" onmouseout="document.getElementById('newsTitle{{publishedAt}}').pause();"><h4>{{title}}</h4></div>` +
            `<div class="card-text mt-4 text-center text-light" id="newsContent{{publishedAt}}"><h5>{{content}}</h5></div>`+
            '</div> '+
            '</div>'
          ;
                var rendered = Mustache.render(html, res.data[0].article[i]);
                document.querySelectorAll(".card-col")[i].innerHTML = rendered;  
                
                
            }
    })
    .catch(err => console.error(err));
  
