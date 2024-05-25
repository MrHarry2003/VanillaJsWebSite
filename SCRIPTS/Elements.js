export class PageInitializer{
  
  constructor() {
       
    //Including other parts of html in one!
    this.loadHeader("../HTML_FILES/header.html");
    this.loadFooter("../HTML_FILES/footer.html");

    }

    async loadHeader(URL){
        let response=await fetch(URL);
        let data=await response.text();
        let header = document.querySelector(".header-section");
        header.innerHTML = data;
            
    }
    async loadFooter(URL){
        let response=await fetch(URL);
        let data=response.text();
        data.then((text)=>{
            let footer = document.querySelector(".footer-section");
            footer.innerHTML = text;
        })
    }

}


/* ACCESS TO COMPONENTS
iframe = document.getElementById("card-section");
iframeDocument = iframe.contentDocument; //document of i-frame

setTimeout(() => {
    let q=document.querySelector("#sort")
    console.log(q);
},100)

/* //Working :-
document.addEventListener('DOMContentLoaded', () => {
    //const sortBtn=document.querySelector('.sort')
    //console.log(sortBtn);
    console.log(iframeDocument.body);
    const container=iframeDocument.getElementById("container");
    console.log(container);
    container.innerHTML="dhvhevf";
  });
*/
