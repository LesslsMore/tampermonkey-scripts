var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("https://api.bilibili.com/x/web-interface/view?bvid=BV1mE411h7Co", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));