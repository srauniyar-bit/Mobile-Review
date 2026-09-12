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
        createdAt: new Date('2024-01-15').toISOString()
    },
    {
        id: 2,
        reviewerName: "Bobby Rai",
        email: "BobbyRai@gmail.com",
        phoneModel: "Google pixel 8",
        rating:4,
        reviewText: "Clean Android experience with timely updates. The AI photo editing features are impressive—Magic Eraser works flawlessly. Display is bright and color-accurate. Battery is decent but not class-leading. Tensor G3 handles daily tasks smoothly but can thermal throttle under sustained load.",
    imageFilename:"   "  //ss
    }
] 
