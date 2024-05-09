const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// Define category schema
const categorySchema = new Schema({
    type: { type: String, default: "Savings" },
    color: { type: String, default: '#FCBE44' }
});

// Define transaction schema
const transactionSchema = new Schema({
    name: { type: String, default: "Anonymous" },
    type: { type: String, default: "Investment" },
    amount: { type: Number },
    date: { type: Date, default: Date.now }
});

// Create Category model
const Category = model('Category', categorySchema);

// Create Transaction model
const Transaction = model('Transaction', transactionSchema);

module.exports = { Category, Transaction };