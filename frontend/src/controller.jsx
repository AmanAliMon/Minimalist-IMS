function director(e) {
    if(e?.actionCode == 1 )//Auth Failure
    {        
        return <p onLoad={location.href = "/login"}></p>
    }
    else if(e?.failure){
        return "Error"
    }
}


export default  director;