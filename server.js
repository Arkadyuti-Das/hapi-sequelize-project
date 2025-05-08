const Hapi=require("@hapi/hapi");
// const routes = require("./routes/route");
require("dotenv").config();
const path=require("path");

const db=require("./models");
const { where } = require("sequelize");

const init=async()=>{
    const server=Hapi.server({
        port: 3000,
        host: "localhost"
    });
    try{
        await server.start();
        console.log("Server started at ", server.info.uri);
        // await sequelize.authenticate();
        // console.log("Database connected");
        await server.register([{
            plugin: require("@hapi/cookie")
        }, {
            plugin: require("@hapi/vision")
        }]);

        // server.auth.strategy("session", "cookie", {
        //     cookie: {
        //         name: "user-cookie",
        //         password: process.env.COOKIE_PASSWORD,
        //         isSecure: false,
        //         ttl: 5*60*1000
        //     },
        //     keepAlive: true,
        //     redirectTo: "/",
        //     validate: async(req, session)=>{}
        // });

        // server.auth.default("session");

        server.views({
            engines: {
                hbs: require("handlebars")
            },
            path: path.join(__dirname, "views"),
            layout: false,
            layoutPath: path.join(__dirname, "views")
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
            // options: {
            //     auth: {
            //         mode: "try"
            //     }
            // }
        },{
            method: "GET",
            path: "/login",
            handler: (req, h)=>{
                if (req.auth.isAuthenticated){
                    return h.redirect("/{username}");
                }
                return h.view("login");
            },
            // options: {
            //     auth: {
            //         mode: "try"
            //     }
            // }
        },
        {
            method: "POST",
            path: "/login",
            handler: async(req, h)=>{
                try {
                    //Check is valid credentials
                    const { username, password }=req.payload;
                    const result=await db.user.findOne({where: {username, password}});
                    if (result){
                        return h.redirect(`/user/${username}`);
                    }
                    //invalid credentials
                    return h.redirect("/login");
                } catch (error) {
                    console.log("Error at route /login for POST: ", error.message);
                }
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
            // options: {
            //     auth: {
            //         mode: "try"
            //     }
            // }
        },
        {
            method: "POST",
            path: "/sign-up",
            handler: async(req, h)=>{
                try {
                    const {username, password}=req.payload;
                    console.log(Object.keys(db));
                    //Check if user exists in the database
                    const result=await db.user.findOne({where: {username}});
                    console.log("result is: ", result);
                    //User exists
                    if (result){
                        return h.view("signup", {message: "Username already exists"}).code(409);
                    }
                    //User doesn't exist, create new user and login the user
                    await db.user.create({username, password});
                    // return `${req.payload.username}`;
                    return h.redirect(`/user/${username}`);
                } catch (error) {
                    console.log("Error inside route /sign-up for POST: ", error.message);
                }
            }
        },
        {
            method: "GET",
            path: "/logout",
            handler: (req, h)=>{
                // req.cookieAuth.clear();
                return h.redirect("/");
            }
        },
        {
            method: "GET",
            path: "/user/{username}",
            handler: (req, h)=>{
                const username=req.params.username;
                console.log(username);
                return h.view("user", {username}, {
                    layout: "layout"
                });
            }
        },
        {
            method: "GET",
            path: "/user/{username}/followers",
            handler: (req, h)=>{
                return h.view("followers");
            }
        },
        {
            method: "GET",
            path: "/user/{username}/following",
            handler: (req, h)=>{
                return h.view("following");
            }
        },
        {
            method: "*",
            path: "/{any*}",
            handler: (req, h)=>{
                return h.view("notfound").code(404);
            },
            // options:{
            //     auth: {
            //         mode: "try"
            //     }
            // }
        }]);
    }
    catch(error){
        console.log("Some error has occurred. Error: ", error.message);
        await server.stop();
    }
}
init();