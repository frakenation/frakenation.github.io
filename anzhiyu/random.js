var posts=["2025/02/03/hello-world/","2025/02/03/第二篇文章/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };