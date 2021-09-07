const express =require('express');
const app = express();
const mongoose=require('mongoose');
const PORT = process.env.PORT || 80;
const MONGODBURL = process.env.MONGODB_URL || 'mongodb://localhost:27017/codebin';
app.set('view-engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))
mongoose.connect(MONGODBURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(()=>{
      console.log("connected to database")
  })
  .catch(err=>{
    console.log(err);
});
const codeModel = require('./models/code');
app.get('/',(req,res)=>{
    res.status(200).render('homepage.ejs',{
        newbtn:true,
    });
})
app.get('/new',(req,res)=>{
    res.render('new.ejs',{
        savebtn:true,
    })
})
app.post('/save',async (req,res)=>{
        const newcode = new codeModel({
            code:req.body.code,
        })
        try{
        newcode.save((err,c)=>{
            if(err){
                console.log(err);
                res.status(500).send("Internal server error");
                return;
            }
            console.log(c.id);
            res.status(200).redirect(`/${c.id}`)
        })
        }catch(err){
            res.status(500).send("internal server error");
            console.log(err);
        }
})
app.get("/:id/duplicate",(req,res)=>{
    try{
    codeModel.findById(req.params.id).exec((err,code)=>{
        if(err){
            res.send("failed");
            return;
        }
    res.render('new.ejs',{code:code.code,savebtn:true,newbtn:true});
    });
    }catch(err){
        console.log(err);
        res.status(500).send("internal error");
    }
})
app.get("/:id",(req,res)=>{
    try{
    codeModel.findById(req.params.id).exec((err,code)=>{
        if(err){
            res.send("failed");
            return;
        }
    res.render('code-display.ejs',{code:code.code,duplicatebtn:true,id:code._id,newbtn:true});
    });
    }
    catch(err){
        console.log(err);
        res.status(500).send("internal server error");
    }
})
app.listen(PORT,()=>{
    console.log("server Running");
})