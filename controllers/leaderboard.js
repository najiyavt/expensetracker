const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/databse');

exports.showLeaderBoard = async (req, res) => {
    try{
        const isPremiumUser = req.user.isPremiumUser;
        if(isPremiumUser){
            const aggriExpense = await User.findAll({attributes:['name','totalCost']});
            res.status(200).json(aggriExpense);
        }else{
            res.status(401).json({ success: false, message: "Unauthorized : you are not a premium user" });
        }
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    };
};
