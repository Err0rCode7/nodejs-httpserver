const Src = document.querySelector(".js-src");

console.log(Src.src);

getSrc = () => {
    fetch('http://118.44.168.218:7070/videos/1.mp4')
    .then( res => {
        return res.json();
    })
    .then( json => {
        const path = json.path;
        Src.src = path;
        console.log(Src.src);
    });
}
/*
.then( response => {
        return response.json();
      })
      .then( myJson => {
        console.log(JSON.stringify(myJson));
      });
*/
setSrc = () => {
    const temp = getSrc();
    console.log(temp);
    Src.src = getSrc();
    console.log(Src.src);
}

function init() {
    getSrc();
}

init();