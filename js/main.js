function loadPosts(placeholderDiv, colCount)
{
    var http = null;
                if (window.XMLHttpRequest) {
                   http = new XMLHttpRequest();
                } else if (window.ActiveXObject) {
                   http = new ActiveXObject("Microsoft.XMLHTTP");
                }
                if (http != null) {
                   http.open("GET", "posts.txt", true);
                   http.onreadystatechange = ausgeben;
                   http.send(null);
                }

                function ausgeben() {
                   if (http.readyState == 4) {
                      var daten = http.responseText;
                      daten = eval("(" + daten + ")");

                      var liste = document.getElementById("Liste");
                      if (colCount < daten.length)
                      {
                          colCount = daten.length;
                      }

                      for (var i = 0; i < colCount; i++) {
                         var post = daten[i];
                        var span = document.createElement("li");

                        var postTitle = document.createElement("h4");
                        postTitle.appendChild(document.createTextNode(post.name));
                        span.appendChild(postTitle);

                        var postText = document.createElement("p");
                        postText.appendChild(document.createTextNode(post.text));
                        span.appendChild(postText);

                        var postMore = document.createElement("p");
                        var postLink = document.createElement("a");
                        postLink.setAttribute("href", post.url);
                        var postLinkText = document.createTextNode('More ...');
                        postLink.appendChild(postLinkText);
                        postMore.appendChild(postLink);
                        span.appendChild(postMore);

                        liste.appendChild(span);
                      }
                   }
                }
}
