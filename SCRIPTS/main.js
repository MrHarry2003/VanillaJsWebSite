import { PageInitializer } from "./Elements.js";
import { PostApi } from "./Api.js";
import { Display } from "./Display.js";

const myPage = new PageInitializer(); //initialized the elements of html page
const productApi = new PostApi();
const storedPost = productApi.allData;
const display = new Display();
let searchedAPost = [];

let iframe = document.getElementById("card-section");
let iframeDocument = iframe.contentDocument;

//INITIALIZING THE POSTS ON THE UI
productApi.getAllPosts(10, 0);
setTimeout(() => {
  //console.log(storedPost.length);
  let iframe = document.getElementById("card-section");
  let iframeDocument = iframe.contentDocument;
  const container = iframeDocument.getElementById("container");

  display.displayPosts(container, storedPost);
}, 1000);

//ADDING SEARCH EVENT TO THE SEARCH BUTTON IN HEADER
setTimeout(async () => {
  document.querySelector("#searchBtn").addEventListener("click", async () => {
    // Get the input element by its ID
    var searchInput = document.getElementById("search");
    // Get the value of the input field
    var searchValue = searchInput.value;
    // Display the search value (you can replace this with your logic)
    productApi.search(searchValue).then((data) => {
      searchedAPost = data;
      let iframe = document.getElementById("card-section");
      let iframeDocument = iframe.contentDocument;
      const container = iframeDocument.getElementById("container");
      display.displayPosts(container, data);
      //After searching making the sort select button to its original select value
      const sortBtn = document.querySelector("#sort");
      sortBtn.value = "original";
      //Setting the buttons accordingly to the searched posts now
      const offsetVal = document.getElementById("offset").value;
      const btnContainer = document.querySelector("#pages");
      display.displayPageBtn(btnContainer, offsetVal, searchedAPost.length);
      pageBtnEvent(offsetVal);
    });
  });
}, 200);

//ADDING THE EVENT IN WHICH IF USER HAS SEARCHED SOMETHING AND WANT TO RETURN TO THE ORIGINAL PAGE ITEM DISPLAY
setTimeout(() => {
  let searchInput = document.querySelector("#search");
  searchInput.addEventListener("change", () => {
    var searchValue = searchInput.value;
    if (searchValue === "") {
      //let iframe = document.getElementById("card-section");
      //let iframeDocument = iframe.contentDocument;
      const container = iframeDocument.getElementById("container");
      searchedAPost = []; //making it empty
      display.displayPosts(container, storedPost);

      //After searching making the sort select button to its original select value
      const sortBtn = document.querySelector("#sort");
      sortBtn.value = "original";
      //Adding original home page buttons again
      const offsetVal = document.getElementById("offset").value;
      const btnContainer = document.querySelector("#pages");
      display.displayPageBtn(btnContainer, offsetVal, 150);
      pageBtnEvent(offsetVal);
    }
  });
}, 200);

//Adding the event of ascending and descending sort of posts by their ids
setTimeout(() => {
  const sortBtn = document.querySelector("#sort");
  sortBtn.addEventListener("change", () => {
    let postArr;
    if (searchedAPost.length == 0) {
      postArr = storedPost;
    } else {
      postArr = searchedAPost;
    }
    const optionVal = sortBtn.value;
    let iframe = document.getElementById("card-section");
    let iframeDocument = iframe.contentDocument;
    const container = iframeDocument.getElementById("container");
    if (optionVal === "asc") {
      let ascArr = deepCopy(postArr);
      ascArr.sort((a, b) => a.title.localeCompare(b.title));
      display.displayPosts(container, ascArr);
    } else if (optionVal === "desc") {
      let descArr = deepCopy(postArr);
      descArr.sort((a, b) => b.title.localeCompare(a.title));
      display.displayPosts(container, descArr);
    } else if (optionVal === "original") {
      display.displayPosts(container, postArr);
    }
  });
}, 100);

//DEEPCOPY
const deepCopy = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return obj; //means it is primitive and it will be assigned to the key of object
  }
  //check if given argument is object or array of objects
  const copy = Array.isArray(obj) ? [] : {}; //remember array is also an object only with keys as indexes
  for (let key in obj) {
    copy[key] = deepCopy(obj[key]);
  }
  return copy;
};

//ADDING THE INFINITE SCROLL EVENT ON THE IFRAME FOR DIPSLAYING THE POSTS
let dbTime2;
iframeDocument.addEventListener("scroll", () => {
  let cont = iframeDocument.getElementById("container");
  var searchInput = document.getElementById("search");
  // Get the value of the input field
  var searchValue = searchInput.value;
  let sortVal = document.querySelector("#sort");
  let optionVal = sortVal.value;
  clearTimeout(dbTime2);
  if (
    iframeDocument.documentElement.scrollTop +
      iframeDocument.documentElement.clientHeight >=
      iframeDocument.documentElement.scrollHeight-10 &&
    searchValue === "" &&
    optionVal === "original"
  ) {
    
    dbTime2=setTimeout(() => {
      let len = storedPost.length;
      productApi.getAllPosts(10, storedPost.length);
      setTimeout(() => {
        if (storedPost.length <= 150 && len != storedPost.length) {
          display.appendPosts(cont, storedPost, len);
        }
      }, 500);
    }, 100);
  }
});

//Adding Fav-Panel button event (Side-panel pop-up)
setTimeout(() => {
  document.getElementById("closeButton").addEventListener("click", function () {
    document.getElementById("panel").style.display = "none";
  });
  const cart = document.querySelector("#cart-section");
  cart.addEventListener("click", () => {
    const panel = document.getElementById("panel");
    panel.style.display = "block";
  });
}, 100);

//AS THERE ARE 150 TOTAL POSTS , ADDING AN EVENT TO THE OFFSET BUTTON THAT WILL ADJUST THE NUMBER
//OF BUTTONS AT THE FOOTER ACCORDING TO THE OFFSET VALUE (EACH PAGE WILL CONTAIN GIVEN OFFSET VALUE NO. OF PAGES)
setTimeout(() => {
  const offsetBtn = document.querySelector("#offset");
  display.displayPageBtn(document.querySelector("#pages"), 10, 150);
  pageBtnEvent(10);
  offsetBtn.addEventListener("change", () => {
    const offsetVal = offsetBtn.value;
    const btnContainer = document.querySelector("#pages");
    //Checking if the current state is in home page or searched page
    let searchInput = document.querySelector("#search");
    let searchValue = searchInput.value;
    display.displayPageBtn(
      btnContainer,
      offsetVal,
      searchValue === "" ? 150 : searchedAPost.length
    );
    pageBtnEvent(offsetVal);
    //the current page has to refresh itself by moving the scroll
    iframeDocument.documentElement.scrollTo(
      0,
      iframeDocument.documentElement.scrollTop - 1
    );
  });
}, 500);

//PAGINATION
//ADDING AUTO SCROLL EVENT TO THE PAGE BUTTONS --> THEY WILL TAKE YOU TO THE SELECTED PAGE ACCORDING TO THE OFFSET
function pageBtnEvent(offsetVal) {
  const pageBtnCollection = document.getElementsByClassName("page-btn");
  for (let i = 0; i < pageBtnCollection.length; i++) {
    //By debouncing i m making sure that my next page is hit once even tho i hit it many times!
    let dbTime; //db-->debounce
    pageBtnCollection[i].addEventListener("click", () => {
      clearTimeout(dbTime);
      dbTime = setTimeout(() => {
        let pageNo = pageBtnCollection[i].id;
        let reqPost = pageNo * offsetVal;
        const len = storedPost.length;

        var searchInput = document.getElementById("search");
        // Get the value of the input field
        var searchValue = searchInput.value;

        if (
          storedPost.length < 150 &&
          searchValue === "" &&
          reqPost - len > 0
        ) {
          productApi.getAllPosts(reqPost - len, len);
        }
        setTimeout(() => {
          //if user is in homepage then only append the home page posts
          if (searchValue === "") {
            display.appendPosts(
              iframeDocument.getElementById("container"),
              storedPost,
              len
            );
          }
          setTimeout(() => {
            const element = iframeDocument.querySelector(".post-container");
            const rect = element.getBoundingClientRect();
            const marginTop = parseInt(
              window.getComputedStyle(element).marginTop
            );
            const totalHeight = rect.height + marginTop + 5;

            const multiplier = Math.floor(offsetVal / 3); //as each of my row contains fixed 3 items
            const scrolledHeight = totalHeight * multiplier * (pageNo - 1);
            iframeDocument.documentElement.scrollTo(0, scrolledHeight);
          }, 100);
        }, 555);
      }, 600);
    });
  }
}

//ADDING THE TOP BUTTON EVENT
setTimeout(() => {
  document.querySelector(".top").addEventListener("click", () => {
    iframeDocument.documentElement.scrollTo(0, 0);
  });
}, 200);

//ADDING EVENT TO PREV BUTTON ON THE PAGINATION
setTimeout(() => {
  document.querySelector("#prev").addEventListener("click", () => {
    const offsetVal = document.querySelector("#offset").value;

    const currentHeight = iframeDocument.documentElement.scrollTop;
    const element = iframeDocument.querySelector(".post-container");
    const rect = element.getBoundingClientRect();
    const marginTop = parseInt(window.getComputedStyle(element).marginTop);
    const totalHeight = rect.height + marginTop;

    const multiplier = Math.floor(offsetVal / 3); //as each of my row contains fixed 3 items
    const scrolledHeight = totalHeight * multiplier;
    iframeDocument.documentElement.scrollTo(0, currentHeight - scrolledHeight);
  });
}, 100);

let currBtnNo = -1;
//Adding scroll event to show the current page on the screen!
//Also adding the next button feature!
setTimeout(() => {
  let allBtns; // document.querySelectorAll(".page-btn");

  iframeDocument.addEventListener("scroll", () => {
    allBtns = document.querySelectorAll(".page-btn");
    const offsetVal = document.querySelector("#offset").value;
    const currentHeight = iframeDocument.documentElement.scrollTop;
    const element = iframeDocument.querySelector(".post-container");
    const rect = element.getBoundingClientRect();
    const marginTop = parseInt(window.getComputedStyle(element).marginTop);
    const totalHeight = rect.height + marginTop;

    let pageNum = Math.ceil(currentHeight / (3 * totalHeight));

    const currPage = document.querySelector("#curr-page");
    let pageval = Math.ceil(pageNum / (offsetVal / 10));
    currPage.innerHTML = pageval == 0 ? 1 : pageval;
    setTimeout(() => {
      if (currBtnNo != pageval - 1) {
        if (currBtnNo != -1 && currBtnNo<allBtns.length) {
          allBtns[currBtnNo].style.backgroundColor = "white";
        }
      }
      currBtnNo = pageval == 0 ? 0 : pageval - 1;
      const currBtn = allBtns[currBtnNo];
      currBtn.style.backgroundColor = "red";
    }, 200);
  });

  document.querySelector("#next").addEventListener("click", () => {
    allBtns = document.querySelectorAll(".page-btn");
    if (currBtnNo == -1) {
      allBtns[1].click();
    } else {
      allBtns[currBtnNo + 1].click();
    }
  });
}, 300);
