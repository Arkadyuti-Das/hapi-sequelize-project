const routes=[{
    method: "GET",
    path: "/",
    handler: (req, h)=>{
        return "Welcome To ABC"
    }
},{
    method: "GET",
    path: "/login",
    handler: (req, h)=>{
        return "login"
    }
},
{
    method: "GET",
    path: "/sign-in",
    handler: (req, h)=>{
        return "sign-in"
    }
},
{
    method: "GET",
    path: "/logout",
    handler: (req, h)=>{
        return h.redirect("/");
    }
},
{
    method: "GET",
    path: "/{username}/followers",
    handler: (req, h)=>{
        return "followers"
    }
},
{
    method: "GET",
    path: "/{username}/following",
    handler: (req, h)=>{
        return "following"
    }
},
{
    method: "GET",
    path: "/{username}",
    handler: (req, h)=>{
        return "my posts"
    }
},
{
    method: "GET",
    path: "/{any*}",
    handler: (req, h)=>{
        return h.response("The page that you're are looking for is unavailable or broken").code(404)
    },
    options:{
        auth: {
            mode: "try"
        }
    }
}];

module.exports=routes;