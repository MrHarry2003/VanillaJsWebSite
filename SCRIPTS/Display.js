export class Display {

  constructor(){
    localStorage.setItem('cartItem',JSON.stringify([]));
  }

  //when infinity scroll works just append more posts to the post container
  appendPosts(container, postArr,num=0) {
    postArr.slice(num).forEach((post) => {
      this.postMaker(post,container);    
    });
  }

  //normally displaying the post on site
  displayPosts(originalContainer,sortPosts){
    // Create a new div element
    const container= document.createElement('div');
    container.id = 'container';

    sortPosts.forEach((post) => {
      this.postMaker(post,container);
    });

    // Replace the original div with the new div
    originalContainer.replaceWith(container);

  }

//converting each post into html cards 
  postMaker(post,container){
    if(!post){
      //if post does not exist skip
    }else{
    var element = document.createElement("div");
    element.className = "post-container";

    var title = document.createElement("h4");
    title.className = "post-title";
    title.innerHTML = post.title;
    element.appendChild(title);

    var body = document.createElement("p");
    body.className = "post-body";
    body.innerHTML = post.body;
    element.appendChild(body);

    var tags = document.createElement("span");
    tags.className = "post-tags";
    tags.innerHTML = post.tags;
    element.appendChild(tags);

    var heart = document.createElement("button");
    heart.className = "addCart";
    heart.innerText="FAV"
    heart.id=post.id;
    //checking if the item is in cart already so that i set its cart to red
    let cartArr=JSON.parse(localStorage.getItem('cartItem'));
    cartArr.forEach((item)=>{
      if(post.id==item.id){
        heart.style.backgroundColor='red';
      }
    })
    element.appendChild(heart);

    heart.addEventListener('click',()=>{

      let cartStr=localStorage.getItem('cartItem');
      let cartArr=JSON.parse(cartStr);

      if(heart.style.backgroundColor!=='red'){
        cartArr.push(post);
        localStorage.setItem('cartItem',JSON.stringify(cartArr));
        const panel=document.querySelector("#panel");
        this.displayCart(panel);
      }
      heart.style.backgroundColor='red';      
      
    })

    container.appendChild(element);}
  }

  //displaying each favourited card or post to the Favourite/cart section of the page using local storage
  displayCart(){
    const content=document.createElement('div');
    content.id="panel-content";

    const arrStr=localStorage.getItem('cartItem');
    let cartArr=JSON.parse(arrStr);

    cartArr.forEach((posts)=>{

      const title=document.createElement('span');
      title.id="cart-item-id";
      title.innerHTML=posts.title;
      title.style.color='yellow';
      content.appendChild(title);

      const remove=document.createElement('button');
      remove.id="removeBtn;"
      remove.innerText="remove";
      title.appendChild(remove);

      remove.addEventListener('click',()=>{
        cartArr = cartArr.filter(function(item) {
          return item.id !== posts.id;
         });

       // console.log(cartArr);
        localStorage.setItem("cartItem",JSON.stringify(cartArr));
        this.displayCart();

        //reflecting the remove cart item on addcart button iframe window
        let iframe = document.getElementById("card-section");
        let iframeDocument = iframe.contentDocument;
        let frameCartBtn=iframeDocument.getElementById(`${posts.id}`);
        //console.log(frameCartBtn);
        frameCartBtn.style.backgroundColor="white";
        
      })

    })

    const originalPanel=document.querySelector("#panel-content");
    originalPanel.replaceWith(content);

  }

  //Displaying button on the footer according to the offset
  displayPageBtn(btnContainer,offsetVal,total){
    let val=Math.ceil(total/offsetVal);  //it is given in the site there are 150 posts total
    const container1=document.createElement('span');
    container1.id="pages";
    for(let i=1;i<=val;i++){
      let btn=document.createElement('button');
      btn.className='page-btn';
      btn.id=i; //in format of 1,2,3
      btn.innerText=i;

      container1.appendChild(btn);
    }
    btnContainer.replaceWith(container1);
  }

}
