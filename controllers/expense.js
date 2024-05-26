const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/databse');

exports.getExpense = async (req, res) => {
    const { pageSize =5 ,page =1} = req.query ;  

    try {
        const expenses = await Expense.findAll({
            where: { UserId: req.user.id },
            limit:parseInt(pageSize),
            offset: (page - 1) * parseInt(pageSize)
        });
        const totalItems = await Expense.count({ 
            where : { UserId:req.user.id }
        })
        res.status(200).json({
            expenses,
            currentPage: parseInt(page),
            totalItems,
            totalPages: Math.ceil(expenses.count / parseInt(pageSize)),
        });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
}

exports.postExpense = async (req, res) => {
    const t = await sequelize.transaction(); //transaction concept imp
    const { amount, description, category } = req.body;
    
    try {
        const expense = await Expense.create({
            amount, 
            description, 
            category, 
            UserId: req.user.id 
        },{
            transaction: t
        });
        const user = await User.findByPk(req.user.id);
        const total = user.totalCost + parseInt(amount);
        await user.update({ totalCost: total } , { transaction:t });

        await t.commit();
        res.status(201).json({ expense, success: true });
        
    } catch (error) {
        await t.rollback();
        console.error('Error creating expense:', error);
        res.status(500).json({success:false, error: 'Failed to create expense' });
    }
}

exports.deleteExpense = async (req, res) => {
     const expenseId = req.params.expenseId;
    if(expenseId === undefined || expenseId === 0){
        return res.status(400).json({success:false})
    }
    const t = await sequelize.transaction(); //transaction concept imp
    try { 
        const currentExpense = await Expense.findByPk(expenseId);
        if (!currentExpense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }
        await currentExpense.destroy();
        
        const user = await User.findByPk(req.user.id);
        const total = user.totalCost - currentExpense.amount;
        await user.update({ 
            totalCost: total 
        } , { 
            transaction:t 
        });
        await t.commit();
        res.status(200).json({success:true,message:"Deleted succesfully"});
    } catch (error) {
        await t.rollback();
        console.error('Error deleting expense:', error);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
}
