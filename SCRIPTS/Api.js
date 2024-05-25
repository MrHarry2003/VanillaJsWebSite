export class ApiManagement{
    URL = 'https://dummyjson.com/posts';
    async get(requirement,have){
        let res = await fetch(this.URL+`?limit=${requirement}&skip=${have}`);
        //console.log("status code:"+res.status + `${URL}?limit=${requirement}&skip=${have}`);
        const { posts } = await res.json();
        //console.log("posts",posts);
        return posts;
    }
}

export class PostApi extends ApiManagement{
    allData = []
    //requirement is the no of items needed more to show on page
    //have is the no of items already loaded and saved and we donnot need to call them again
    async getAllPosts(requirement,have){ 
        let postArr=await this.get(requirement,have);
        let k=0;
        for(let i=have;i<have+requirement;i++){
            this.allData[i]=(postArr[k]);
            k++;
        }
        //console.log(this.allData);
    }
    //searching particular post and returning the result array
    async search(searchValue){

        let res = await fetch(`https://dummyjson.com/posts/search?q=${searchValue}`);
//        console.log(`https://dummyjson.com/posts/search?q=${searchValue}`);
        let {posts}= await res.json();
        return posts;
    }

}
//https://dummyjson.com/posts?limit=10&skip=30

