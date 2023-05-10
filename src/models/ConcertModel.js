const sequelize = require("../config/Database")
const DataTypes = require("sequelize")

const ConcertModel = sequelize.define("concert",{
    id_concert:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    country:{
        type: DataTypes.STRING,
        allowNull:false
    },
    city:{
        type: DataTypes.STRING,
        allowNull:false
    },
    start_date:{
        type:DataTypes.DATE,
        allowNull:false
    },
    description:{
        type: DataTypes.STRING,
        allowNull:false
    }
})

sequelize.sync().then(()=>console.log("Concert table created successfully")).catch(err=>console.log(err))
module.exports = ConcertModel