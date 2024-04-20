const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu.js');
const CategoryModel = require('../models/Category');
const multer = require('multer');

// const upload = require('uploads')
const cloudinary = require('cloudinary').v2;

const fs = require('fs');
const { body, validationResult } = require('express-validator');

const imgconfig = multer.diskStorage({
    destination:(req,file,cb=>{
        cb(null,`image-${Date.now()}.${file.originalname}`)
    })
})

const isImage = (req,file,cb)=>{
    if(file.mimetype.startsWith("image")){
        cb(null,true)
    }else{
        cb(new Error("only images allow"))
    }
}

const upload = multer({
    storage:imgconfig,
    fileFilter:isImage
})

router.post("/register",upload.single("photo"),async(req,res)=>{
console.log(req.file);
})
cloudinary.config({
    cloud_name: 'dngh5sdod',
    api_key: '952761938341686',
    api_secret: '4Acd3j1XfpDQpcasMK-LN0mNyCY'
});

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


router.post('/upload', (req, res, next) => {
    const file = req.file.image;
    cloudinary.uploader.upload(file.tempFilepath, (err, result) => {
        console.log(result)
    })
})


router.post('/add', [
    body('Rname', 'Enter a full name').isLength({ min: 5 }),
    body('address', 'Enter full address ').isLength({ min: 10 }) // Changed from max to min

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { // Corrected the condition to check if there are errors
        return res.status(400).json({ errors: errors.array() });
    }
    const { Rname, category, address, state, city } = req.body;
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
            Rname, category, address, state, city
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


//   const storage = multer.memoryStorage(); // Store images in memory for uploading to Cloudinary
// const upload = multer({ storage: storage });
// router.post('/upload', upload.single('image'), async (req, res) => {
//     try {
//       // Upload image to Cloudinary
//       const result = await cloudinary.uploader.upload(req.file.buffer.toString('base64'));
//       res.json(result); // Send the response containing Cloudinary's upload result
//     } catch (error) {
//         console.error(error);
//       res.status(500).json({ error: 'Something went wrong with the upload' });
//     }
//   });
// const upload = multer({
//     storage: multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, './uploads')
//         },
//         filename: function (req, file, cb) {
//             cb(null, `${file.fieldname }+ "-" + ${Date.now()}.jpg`)
//         }
//     })
// })

// router.post('/api/post', upload.single('image'), (req, res) => {
//     const newPost = {
//         "id": `${Date.now()}`,
//         "title": req.body.title,
//         "content": req.body.content,
//         "post_image": req.file.path.replace("\\", "/"),
//         "added_date": `${Date.now()}`
//     }
//     postsData.add(newPost)
//     res.status(201).send(newPost)
// if (!req.file) {
// return res.status(400).json({ error: 'No file uploaded' });
// }
// File upload successful, send response
// res.status(200).json({ success: true, message: 'File uploaded successfully', filename: req.file.filename });
// });