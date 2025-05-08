const {Sequelize, DataTypes}=require("sequelize");
const sequelize=new Sequelize("hapi-sequelize", "root" ,"password", {
    host: "localhost",
    dialect: "mysql"
});

async function main(){
    await sequelize.authenticate();
    console.log("Database connected and authenticated");

    const userModel=sequelize.define("user", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },{
        freezeTableName: true
    });

    await userModel.sync({alter: true});
    console.log("Model synced");
}
main()