const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu.js');
const CategoryModel = require('../models/Category');

const { body, validationResult } = require('express-validator');


router.get('/fetchAllData', async (req, res) => {
    const category = req.query.category; // Access query parameter using req.query
    try {
        let menu;
        if (!category || category === 'all') {
            menu = await Menu.find(); // Fetch all data if category is not provided or 'all'
        } else {
            menu = await Menu.find({ category: category }); // Fetch data by category
        }
        res.json(menu);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
});

router.get('/fetchcategory', async (req, res) => {
    
    try {
        let menu;
         
            menu = await CategoryModel.find(); // Fetch all data if category is not provided or 'all'
         
        res.json(menu);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
});



router.post('/add', [
    body('Rname', 'Enter a full name').isLength({ min: 5 }),
    body('address', 'Enter full address ').isLength({ min: 10 }) // Changed from max to min

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { // Corrected the condition to check if there are errors
        return res.status(400).json({ errors: errors.array() });
    }
    const { Rname, category, address, state, city,imageUrl } = req.body;
    try {
        let existingMenu = await Menu.findOne({
            $and: [
                { Rname: Rname },
                { category: category }
            ]
        });
        if (existingMenu) {
            let errorMessage = "";
            if (existingMenu.Rname === Rname) { // Corrected from existingUser to existingMenu
                errorMessage = "Sorry, a menu with this restaurant name already exists."; // Corrected error message
            } else if (existingMenu.category === category) { // Corrected from existingUser to existingMenu
                errorMessage = "Sorry, a menu with this category already exists."; // Corrected error message
            }
            return res.status(400).json({ success: false, error: errorMessage });
        }
        const menu = new Menu({
            Rname, category, address, state, city,imageUrl
        })
        const savedMenu = await menu.save()
        res.json(savedMenu)
        if (!savedMenu) {
            res.status(400).json({ error: "Not Added" })
        }
        else {
            res.status(200).json({ message: "Added" })
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error");
    }
});

router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;

        // Check if the 'q' parameter is provided
        if (!q) {
            return res.status(400).json({ error: 'Query parameter "q" is required' });
        }
        
        // Perform case-insensitive search on 'name' and 'description' fields
        const results = await Menu.find({
            $or: [
                { Rname: { $regex: q, $options: 'i' } }, 
                { category: { $regex: q, $options: 'i' } }, 
                { address: { $regex: q, $options: 'i' } }
            ]
        });

        // Check if any results were found
        if (results.length === 0) {
            return res.status(404).json({ error: 'No products found matching the search query' });
        }

        // Return the search results
        res.json(results);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ error: 'Error searching products' });
    }
});

module.exports = router;
