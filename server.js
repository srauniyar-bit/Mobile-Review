const express =require('express');
const multer= require('multer');
const cors= require('cors');
const path= require('path');
const fs= require('fs');
const app= express();
const PORT= 3000;

app.use(cors());
app.use(express.json());
app.use('/ss',express.static('ss'));

if (!fs.existsSync('ss')) {
    fs.mfdirSync('ss');

}

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'/ss');
    
},
filename: function(req,file,cb){
const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }

});

const upload= multer({
    storage: storage,
    limits:{fileSive: 5*1024*1024}, //5 mb is the limit of the files here,no more then 5mb will cause error important
fileFilter:function(req,file,cb){
const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

let reviews = [
    {
        id: 1,
        reviewerName: "Sarah magar",
        email: "sarah@email.com",
        phoneModel: "iPhone 15 Pro",
        rating: 5,
        reviewText: "The titanium build quality is exceptional. The Action Button is genuinely useful once customized. Battery life easily lasts a full day with heavy usage. Camera system produces stunning photos in low light. The 5x telephoto is a game-changer for portrait photography.",
        imageFilename: "  ",  //ss
        createdAt: new Date('2026-09-01').toISOString()
    },
    {
        id: 2,
        reviewerName: "Bobby Rai",
        email: "BobbyRai@gmail.com",
        phoneModel: "Google pixel 8",
        rating:4,
        reviewText: "Clean Android experience with timely updates. The AI photo editing features are impressive—Magic Eraser works flawlessly. Display is bright and color-accurate. Battery is decent but not class-leading. Tensor G3 handles daily tasks smoothly but can thermal throttle under sustained load.",
    imageFilename:"   " , //ss
    createdAt: new Date('2026-07-05').toISOString()
    },
    {
    id: 3,
    reviewerName: "Don Gonzalo",
    email: "gonzaluDon@gmail.com",
    phoneModel: "Samsung S24",
    rating:5,
    reviewText: "The S Pen integration is unmatched for productivity. Display is the best in any smartphone—2000 nits peak brightness is visible even in direct sunlight. Galaxy AI features are surprisingly practical for translation and note summarization. Build feels solid and premium.",
    imageFilename:"   " , //ss
    createdAt: new Date('2026-06-09').toISOString
    },
{
id: 4,
        reviewerName: "David Neupane",
        email: "davidneu@email.com",
        phoneModel: "OnePlus 12",
        rating: 4,
        reviewText: "Incredible value for the specs. Snapdragon 8 Gen 3 delivers flagship performance at a lower price. 100W charging is ridiculously fast—0 to 100% in 26 minutes. Hasselblad-tuned cameras produce natural colors. OxygenOS is clean with useful customization options.",
        imageFilename: "  ", //ss
        createdAt: new Date('2026-05-05').toISOString()
},

{
id: 5,
        reviewerName: "David Neupane",
        email: "davidneu@email.com",
        phoneModel: "OnePlus 12",
        rating: 4,
        reviewText: "Incredible value for the specs. Snapdragon 8 Gen 3 delivers flagship performance at a lower price. 100W charging is ridiculously fast—0 to 100% in 26 minutes. Hasselblad-tuned cameras produce natural colors. OxygenOS is clean with useful customization options.",
        imageFilename: "  ", //ss
        createdAt: new Date('2024-09-20').toISOString()


},
];

let nextId=6;

app.get('/api/reviews', (req, res) => {
    const search = req.query.search?.toLowerCase() || '';
    
    let filteredReviews = reviews;
    if (search) {
        filteredReviews = reviews.filter(r => 
            r.phoneModel.toLowerCase().includes(search) ||
            r.reviewText.toLowerCase().includes(search) ||
            r.reviewerName.toLowerCase().includes(search)
        );
    }
    
    filteredReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(filteredReviews);
});

app.post('/api/reviews', upload.single('image'), (req,res)=>{
    try{
        const{reviewerName, email, phoneModel, rating, reviewText} =req.body;
        if(!reviewerName || !email || !phoneModel || !rating || !reviewText){
            if(req.file){
                fs.unlinkSync(path.join('ss',req.file.filename));
            }
            return res.status(400).json({error:'All fields are required'})
        }
        const newReview ={
            id: nextId++,
            reviewername,
            email,
            phoneModel,
            rating: parseInt(rating),
            reviewText,
            imageFilename: req.file ? req.file.filename : null,
            createdAt: new Date(). toISOString()
        };
        reviews.push(newReview);
        res.status(201).json(newReview);
    }catch(error){
        if (req.file){
            fs.unlinkSync(path.join('ss',req.file.filename));
        }
        res.status(500).json({ error: 'Failed to submit review'});
    }
} );

app.use((error,req,res,next)=>{
    if(error instanceof multer.MulterError){
        if (error.code === 'LIMIT_FILE_SIZE'){
            return res.status(400).json({ error:'File size too large. Maximum 5MB.'});
        }
    }
    res.status(500).json({ error: error.message || 'Internal server error'});
});

app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`);
});


