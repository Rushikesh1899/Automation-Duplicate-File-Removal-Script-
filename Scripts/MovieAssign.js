const dataFetch = async(search)=>{              //Here we Fetch Data from that given OMDBAPI Link
    const resp = await axios.get('http://www.omdbapi.com/',{
        params:{
            apikey:'ac89ebd5',
            s: search
        }
    });
    if(resp.data.Error){    // If searched movie is not found then we get error so that why we return empty array
        return [];
    }
    return resp.data.Search;
}
const root = document.querySelector('.autoComplete')         //Create Html for inputbox and dropdown box
root.innerHTML=`            
    <lable><b>Search Movie</b></lable>             
    <input class="input" placeholder="Search Movie Here And Add It Into Grid " />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div> 
    </div>
`
const input = document.querySelector('input'); 

const dropdown = document.querySelector('.dropdown')

const reslWrap = document.querySelector('.results')


const onInput = async event =>{            
    const movies = await dataFetch(event.target.value);
 
    if(!movies.length){
        dropdown.classList.remove('is-active');         //whenever user earase input then it will remove dropdown box 
        return;
    }

    reslWrap.innerHTML='';
    dropdown.classList.add('is-active')    //After fetching the data open up the dropdown and then add in all of our movies to it
    
    for(let mov of movies){
        const list = document.createElement('a')
        const imgSrc = mov.Poster ==='N/A' ? '' : mov.Poster;   //if there is no image available then it returns null otherwise poster of movie

        list.classList.add('dropdown-item')
        list.innerHTML=`
            <img src="${imgSrc}"/>        
            ${mov.Title} (${mov.Year})
        `
        list.addEventListener('click',()=>{                 //when user clicks on any movie then it will add into input box
            input.value = mov.Title;
            dropdown.classList.remove('is-active')
            input.value='';
            input.focus();
            MovieSelection(mov,document.querySelector('.container2'))                     //we create another function for sending request to the api and get data from it 
        })
        reslWrap.appendChild(list)
    }
}

const debounce =(func,delay=500)=>{    //if we type into the input box then whenever we type then that time 
    let timeoutID;                     //it render all character by character so thats why we put setTimeOut Function
    return (...arg)=>{                  
        if(timeoutID){
            clearTimeout(timeoutID)
        }
        timeoutID = setTimeout(() => {
            func.apply(null, arg);
        }, delay);
    }
}

input.addEventListener('input', debounce(onInput, 500));    

document.addEventListener('click', event =>{
    if(!root.contains(event.target)){
        dropdown.classList.remove('is-active')    //if we want to close the dropdown box // whenever user clicks on others side which means on window then it will close
    }
})

const MovieSelection = async (movi,containerElement) =>{
    const respo = await axios.get('http://www.omdbapi.com/',{           //this function is used to get information of selected movie and show it on display
        params:{
            apikey: 'ac89ebd5',
            i: movi.imdbID 
        }
    })   
    movi = respo.data;

    const Compare = document.querySelectorAll('.items')

    for(let comp of Compare){
        let separate = comp.innerText.split("\n")

        if(movi.Title === separate[0]){
            console.log(movi.Title);
            alert("This Movie is Already Added Into List")
            return;
        }
    }

    const div = document.createElement('div')
    div.classList.add('items')

    const i = document.createElement('i')
    i.classList.add('fa-solid')
    i.classList.add('fa-heart')

    div.innerHTML=`
        <img src="${movi.Poster}"/>
        <h1>${movi.Title}</h1>
        <h1>${movi.Year}</h1>
        <i class="fa-solid fa-star Rate">${movi.imdbRating}</i> 
    `
    const btn = document.createElement('button')
    btn.classList.add('btn');

    div.appendChild(btn)
    btn.appendChild(i)
    containerElement.appendChild(div)
    
    btn.addEventListener('click', () =>{
       
        const div2 = document.createElement('div')
        div2.classList.add('items2')

        const Compare = document.querySelectorAll('.items2')
        
        for(let comp of Compare){
            let separate = comp.innerText.split("\n")
            if(movi.Title === separate[0]){
                alert("This Movie is Already Added Into Favourite Movie List")
                return;
            }
        }
         
        const del = document.createElement('i')
        del.classList.add('fa-solid')
        del.classList.add('fa-trash-can')
        
        div2.innerHTML=`
        <img src="${movi.Poster}"/>
        <h1>${movi.Title}</h1>
        <h1>${movi.Year}</h1>
        <i class="fa-solid fa-star Rate">${movi.imdbRating}</i> 
    `
        const btn1 = document.createElement('button')
        btn1.classList.add('btn1');

        div2.appendChild(btn1)
        btn1.appendChild(del)
        document.querySelector('.container3').appendChild(div2)

        btn1.addEventListener('click', () =>{
            if(confirm("Are You Sure You Want to Delete It From Favourite List")){
                div2.remove()
            }
        })
    })
    
}
