const Hapi=require("@hapi/hapi");
// const routes = require("./routes/route");
require("dotenv").config();
const path=require("path");


const init=async()=>{
    const server=Hapi.server({
        port: 3000,
        host: "localhost"
    });
    try{
        await server.start();
        console.log("Server started at ", server.info.uri);
        await server.register([{
            plugin: require("@hapi/cookie")
        }, {
            plugin: require("@hapi/vision")
        }]);

        server.auth.strategy("session", "cookie", {
            cookie: {
                name: "user-cookie",
                password: process.env.COOKIE_PASSWORD,
                isSecure: false,
                ttl: 5*60*1000
            },
            keepAlive: true,
            redirectTo: "/",
            validate: async(req, session)=>{}
        });

        server.auth.default("session");

        server.views({
            engines: {
                hbs: require("handlebars")
            },
            path: path.join(__dirname, "views")
        })

        // server.route(routes);
        server.route([{
            method: "GET",
            path: "/",
            handler: (req, h)=>{
                if (req.auth.isAuthenticated){
                    return h.redirect("/users");
                }
                return h.view("index");
            },
            options: {
                auth: {
                    mode: "try"
                }
            }
        },{
            method: "GET",
            path: "/login",
            handler: (req, h)=>{
                if (req.auth.isAuthenticated){
                    return h.redirect("/{username}");
                }
                return h.view("login");
            },
            options: {
                auth: {
                    mode: "try"
                }
            }
        },
        {
            method: "POST",
            path: "/login",
            handler: (req, h)=>{
                return "logged in";
            }
        },
        {
            method: "GET",
            path: "/sign-up",
            handler: (req, h)=>{
                if (req.auth.isAuthenticated){
                    return h.redirect("/");
                }
                return h.view("signup");
            },
            options: {
                auth: {
                    mode: "try"
                }
            }
        },
        {
            method: "POST",
            path: "/sign-up",
            handler: (req, h)=>{
                if (req.auth.isAuthenticated){
                    return h.redirect("/");
                }
                return h.view("signup");
            }
        },
        {
            method: "GET",
            path: "/logout",
            handler: (req, h)=>{
                req.cookieAuth.clear();
                return h.redirect("/");
            }
        },
        {
            method: "GET",
            path: "/user/{username}",
            handler: (req, h)=>{
                return "my posts"
            }
        },
        {
            method: "GET",
            path: "/user/{username}/followers",
            handler: (req, h)=>{
                return "followers"
            }
        },
        {
            method: "GET",
            path: "/user/{username}/following",
            handler: (req, h)=>{
                return "following"
            }
        },
        {
            method: "*",
            path: "/{any*}",
            handler: (req, h)=>{
                return h.view("notfound").code(404);
            },
            options:{
                auth: {
                    mode: "try"
                }
            }
        }]);
    }
    catch(error){
        console.log("Some error has occurred. Error: ", error.message);
        await server.stop();
    }
}
init();