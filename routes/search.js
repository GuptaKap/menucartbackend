// const express = require('express');
// const router = express.Router();
// const Menu = require('../models/Menu.js');



// // POST route to add a new category
// router.post('/adds', async (req, res) => {
//     try {
//         // Extract name and image from request body
//         const { category } = req.body;

//         // Create a new instance of CategoryModel
//         const newMenu = new Menu({
//             category : category
//         });

//         // Save the new category to the database
//         const savedMenu = await newMenu.save();

//         res.status(201).json(savedMenu); // Return the saved category as JSON response
//     } catch (error) {
//         console.error("Error saving category:", error);
//         res.status(500).send("Internal server error");
//     }
// });

// module.exports = router;

// // router.get('/search', async (req, res) => {
// //     const q = req.query;
// //     try {
// //         if (!q) {
// //             return res.status(400).json({ error: 'Query parameter is required' });
// //         }
// //         const result = await Menu.find({
// //             $or: [
// //                 { category: { $regex: q, $options: 'i' } }, // Case-insensitive search by name
// //                 { address: { $regex: q, $options: 'i' } }, // Case-insensitive search by description
// //             ],
// //         });
// //         if (!result) {
// //             return res.status(404).json({ error: 'No products found' });
// //         }

// //         res.json(result);
        
// //     } catch (error) {
// //         console.error('Error searching products:', error);
// //         res.status(500).json({ error: 'Error searching products' });
// //     }
// // });


