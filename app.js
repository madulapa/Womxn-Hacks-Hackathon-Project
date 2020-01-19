var express=require("express"); 
var bodyParser=require("body-parser"); 
const path = require('path');
const router = express.Router();

require('dotenv').config();
  
const mongoose = require('mongoose'); 
mongoose.connect('mongodb+srv://admin:admin@clusterhack-lsqdq.mongodb.net/test?retryWrites=true&w=majority'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 
  
var app=express() 
  
  
app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
    extended: true
})); 
  
app.post('/index', function(req,res){ 
    var name = req.body.name; 
    var email =req.body.email; 
    var pass = req.body.password; 
    var phone =req.body.phone; 
    var sisters = req.body.sisters;
  
    var data = { 
        "name": name, 
        "email":email, 
        "password":pass, 
        "phone":phone,
        "sisters":sisters
    } 
    console.log(data)
    db.collection('more').insertOne(data,function(err, collection){ 
        if (err) throw err; 
        console.log("Record inserted Successfully"); 
           
        
    }); 
        
    console.log('log', data)
   // res.redirect('signup_success'); 

   if(sisters == "Big")
   {      
        //res.sendFile(path.join(__dirname,'/Big.html'));
        res.redirect('/little' 
        )}
    else
    {
    //res.sendFile(path.join(__dirname,'/Little.html'));
    res.redirect('/big')
   
}
    
    }
    

)

//app.get('/signup_success')

router.get('/signup_success',function(req,res){

    res.sendFile(path.join(__dirname,'/signup_success.html'));
});

app.get('/user', function(req, res) {
    console.log(req.query.id)
    res.json({example:"test"});
})

app.get('/users', function(req, res) {
    console.log(req.query.id)

    db.collection('more').find({}, function(err, item){
        console.log(item);
        res.json(item[0]);
    })

    // res.json({example:"test"});
})
  
  
// app.get('/',function(req,res){ 
// res.set({ 
//     'Access-control-Allow-Origin': '*'
//     }); 
//     return res.redirect('index.html'); 
// }).listen(3000) 

router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/home.html'));
});

router.get('/index',function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.use('/', router);
app.listen(process.env.port || 3000);
app.set('view engine', 'pug')

app.get('/little', function (req, res) {
    db.collection('more').find({"sisters": "Big"}).toArray( function(err, items){
        console.log(items);

        res.render('little', { items: items, message: 'Additional Bigs: '})
    })
  })

  app.get('/big', function (req, res) {
    db.collection('more').find({"sisters": "Little"}).toArray( function(err, items){
        console.log('items', items);

        res.render('big', { items: items, message: 'Additional Littles: '})
    })
  })

  
console.log("server listening at port 3000"); 



