import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

export function Query(){
    const {error,data,isError,isLoading}=useQuery(
        {
            queryKey: ['sanjay'],
            queryfn:()=>{
            return Promise.resolve("sanjay kumar")
        }//we have other parameters in useQuery like staleTime,cacheTime etc
        }
    )
    console.log({error,data})
}



export default function Toggle(){
    const [show,setshow]=useState(true)
    function toggle(){
        
        return (
        setshow(show=>!show)
        
        )
    }
    return(
        <div>
            {show && <button> I will vanish like Will and ReAppear</button>}
            <button onClick={toggle} style={{margin:5}}> Click me</button>
        </div>
    )
}





export function Toggle2(){

    const [fetch,setfetch]=useState(true)
    function fetcher(){
        return new Promise(resolve=>{
            return setTimeout(resolve,1000)//here promise ia a function that gives value in future 
            //1000 wil in the form of milliseconds so 1000ms=1s
            //the resolve inside the setTimeOut is called after 1s(the resolve can be anything we want to return after 1s)
       
        })
    }
     useQuery(
        {
            queryKey:['fetchData'],
            queryFn:()=>{
                return fetcher()
            },
            enabled:fetch//it is used in react query instead of conditional statments
        }
    )
    
    return (
        <div>
            <button onClick={()=>setfetch(fetch=>!fetch)}> Fetch</button>
        </div>
    )
}




export function Repo(){
       
        const [reponame,setreponame]=useState("")

         const fetcher=(reponame)=>{
            return fetch('https://api.github.com/repos/'+reponame+'').then(res=>res.json())
        }
        
        const {data,error,isLoading,refetch}=useQuery({
            queryKey:["repository",reponame],
            queryFn:()=>fetcher(reponame),
            enabled:false,//if it is false it cannot fetch data automatically we have to use refetch to fetch data manually

        })
        const handleKeyDown=(event)=>{
            if(event.key==='Enter'){
                //refetch is inbuild in useQuery
                const name=reponame.trim()
                if(name){
                    refetch()
                }//refetch is used to manually fetch the data when enabled is false
            }
        }

    return (
            <div>
                <input onKeyDown={handleKeyDown} type="text" value={reponame} onChange={(event)=>setreponame(event.target.value)}></input>
        
                {(isLoading || reponame==="") && <h2>Loading..</h2>}
                
                {error && <h2>Error Occured</h2>}
                
                {data && <p>{data.name}</p>}
                {data && <p>{data.Stars}</p>}
            </div> 
        )


}






export function PracticeQuery() {
            const [visited, setVisited] = useState(new Set()); // optional, kept from your original
            const queryClient = useQueryClient();

            const fetcher = (url) => fetch(url).then((res) => res.json());

            const { data, error, isLoading, refetch } = useQuery({
                queryKey: ["practice"],
                queryFn: () => fetcher("https://jsonplaceholder.typicode.com/posts"),
                enabled: false, // manual fetch
                // remove duplicate userId posts (keep first post per userId)
                select: (items) => {
                const seen = new Set();
                return items.filter((item) => {
                    if (seen.has(item.userId)) return false;
                    seen.add(item.userId);
                    return true;
                });
                },
            });

            function ManuallyFetch() {
                refetch();
            }
            function visitedfn(itemid) {
                
                setVisited(
                   prev=>{
                        const next=new Set(prev)
                         next.add(itemid)
                        return next
                    }
                        )
            }

            if (isLoading) return <h3 style={{ color: "gray" }}>Loading....</h3>;
            if (error) return <h3 style={{ color: "red" }}>Error Occured!</h3>;

            // read cached transformed value (same shape as `data` because we used select)
            //const cachedData = queryClient.getQueryData(["practice"]); // undefined or array

            if (data) {
                return (
                <div>
                    {data.map((item) => {
                    // correct find syntax — returns the matching cached item or undefined
                    //const visited =Array.isArray(cachedData) && cachedData.find((c) => c.id === item.id);

                    return (
                        <div key={item.id} style={{ marginBottom: 12 }}>
                        <h3 style={{ fontWeight: "bolder" }}>{item.userId}.</h3>

                        {/* anchor kept from your original; preventDefault avoids navigation */}
                        <a href="#" onClick={(e) => e.preventDefault()}>
                            <h3 style={{ fontWeight: "bold", fontStyle: "italic",color:"black" }} onClick={(e)=>{visitedfn(item.id)}}>
                            {item.body}<span style={{color:"yellow",margin:10}}>{visited.has(item.id) ? "Visited" : ""}</span>
                            </h3>
                        </a>
                        </div>
                    );
                    })}
                </div>
                );
            }

            return (
                <div>
                <button style={{ margin: 10, padding: 10 }} onClick={ManuallyFetch}>
                    Click Me
                </button>
                </div>
            );
}


export function PostMutation(){

    const mutation=useMutation({
        //json placeholder always returns onlythe new data we post
        mutationFn:async()=>{
            //js does not wait for fetch to complete so we have to use await
            const result=await fetch('https://jsonplaceholder.typicode.com/posts',{//we used await here because fetch returns a promise
                //so we have to wait until fetch gets resolved(completes the fetching)
                method:'post',
                headers: { "Content-Type": "application/json" },//it is necessary to add headers while posting data to indicate the type of data we are sending is json
                body:JSON.stringify({title:'sanjay',body:'I am modifying the data!'})//stringify is used to convert js object to json object
            });
            return result.json();//we return result.json() because fetch returns a response object and we have to convert it to json to use it

        },
        
    });

    async function Loading(){
       await mutation.mutateAsync()
    }
    return (
        <div>
            <button onClick={Loading}> Click Me to Load Posts</button>
            {mutation.isLoading && <p>Loading....</p>}
            {mutation.isError && <p>Error.occured</p>}
            {/**Mutation is not an array so we cannot use map */}
            {mutation.isSuccess && <p>ID:<span style={{color:'red'}}>{mutation.data.id}</span></p> }
            {mutation.isSuccess && <p>Tilte:<span style={{color:'red'}}>{mutation.data.title}</span></p> }
            {mutation.isSuccess && <p>Body:<span style={{color:'red'}}>{mutation.data.body}</span> </p> }
        </div>
    )
}