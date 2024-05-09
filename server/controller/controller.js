//const Category = require('../models/model').Category; // Assuming Category is the correct model name
const { Transaction,Category } = require('../models/model');

// Function to create a new category
async function createCategory(req, res) {
    try {
        // Create a new category instance based on request data
        const newCategory = new Category({
            type: req.body.type || "Savings", // Default to "Investment" if type is not provided
            color: req.body.color || "#FCBE44" // Default color if not provided
        });

        // Save the new category to the database
        const savedCategory = await newCategory.save();

        // Return the saved category as JSON response
        res.status(201).json(savedCategory); // 201 status for successful creation
    } catch (error) {
        console.error('Error while creating category:', error);
        res.status(400).json({ message: `Error while creating category: ${error.message}` });
    }
}

 //Function to retrieve all categories
async function getCategory(req, res) {
    try {
        // Fetch all categories from the database
        const categories = await Category.find({});

        // Return categories as JSON response
        res.json(categories);
    } catch (error) {
        console.error('Error while fetching categories:', error);
        res.status(500).json({ message: `Error while fetching categories: ${error.message}` });
    }
}

// Function to create a new transaction
async function createTransaction(req, res) {
    try {
        // Check if request body is empty or not provided
        if (!req.body) {
            return res.status(400).json({ message: "Post HTTP Data not Provided" });
        }

        // Destructure required fields (name, type, amount) from request body
        const { name, type, amount } = req.body;

        // Check if required fields are missing in the request body
        if (!name || !type || !amount) {
            return res.status(400).json({ message: "Please provide name, type, and amount for the transaction" });
        }

        // Create a new transaction instance based on request data
        const newTransaction = new Transaction({
            name,
            type,
            amount,
            date: new Date() // Automatically set the current date/time
        });

        // Save the new transaction to the database
        const savedTransaction = await newTransaction.save();

        // Return the saved transaction as JSON response
        res.status(201).json(savedTransaction); // 201 status for successful creation
    } catch (error) {
        console.error('Error while creating transaction:', error);
        res.status(400).json({ message: `Error while creating transaction: ${error.message}` });
    }
}
async function getTransaction(req, res) {
    try {
        // Fetch all transactions from the database
        const transactions = await Transaction.find({});

        // Return transactions as JSON response
        res.json(transactions);
    } catch (error) {
        console.error('Error while fetching transactions:', error);
        res.status(500).json({ message: `Error while fetching transactions: ${error.message}` });
    }
}


// Function to delete a transaction by ID
async function deleteTransaction(req, res) {
    try {
        // Check if _id is provided in the request body
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({ message: "Please provide a valid _id to delete the transaction" });
        }

        // Delete the transaction by _id
        const deleteResult = await Transaction.deleteOne({ _id });

        if (deleteResult.deletedCount > 0) {
            return res.json({ message: "Transaction record deleted successfully" });
        } else {
            return res.status(404).json({ message: "Transaction not found or already deleted" });
        }
    } catch (error) {
        console.error('Error while deleting transaction:', error);
        res.status(500).json({ message: `Error while deleting transaction: ${error.message}` });
    }
}



// Function to retrieve transaction labels with associated category information
async function getLabels(req, res) {
    try {
        const result = await Transaction.aggregate([
            {
                $lookup: {
                    from: "categories", // Use the actual collection name
                    localField: 'type',
                    foreignField: 'type',
                    as: 'categories_info'
                }
            },
            {
                $unwind: "$categories_info"
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    type: 1,
                    amount: 1,
                    color: "$categories_info.color"
                }
            }
        ]);

        // Map the result to include only necessary fields
        const data = result.map(item => ({
            _id: item._id,
            name: item.name,
            type: item.type,
            amount: item.amount,
            color: item.color
        }));

        res.json(data);
    } catch (error) {
        console.error('Error while fetching labels:', error);
        res.status(400).json({ message: "Lookup Collection Error" });
    }
}

module.exports = {
    createCategory,
    getCategory,
    createTransaction,
    getTransaction,
    deleteTransaction,
    getLabels
};



