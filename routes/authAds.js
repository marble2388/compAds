var express = require('express');
var router = express.Router();

//add the ad model
var Ad = require('../models/Ad')

/* GET home page. */
router.get('/', function(req, res, next) {

    //find ads
    Ad.find(function(err, ads){
        if (err){
            console.log(err);
            res.render('error');
            return;
        }


        //send ads to index
        res.render('./ads/index', {
            ads: ads,
            title: 'ADS!?!',
            user: req.user
        });
    });
});
//add view
router.get('/add' , function(req, res, next){

    //show add form
    res.render('ads/add', {
        title: 'ADD Ad!'
    });

});
//post added Ad to db
router.post('/add' , function(req, res, next){

    //add the Ad
    Ad.create({
        Title: req.body.Title,
        Description: req.body.Description,
        Price: req.body.Price
    }, function(err,ad){
        if (err) {
            console.log(err);
            res.render('error');
            return;
        }
        //if good load ads view
        res.redirect('/ads',{
            title: 'ADS!?!'
        });
    });
});
//delete ad using _id
router.get('/delete:_id', function(req,res,next){

    //get id param from end of the url
    var _id = req.params._id;

    // use mongoose to delete the ad
    Ad.remove({_id: _id }, function(err) {
        if (err) {
            console.log(err);
            res.render('error');
            return;
        }
        //if good load ads view
        res.redirect('/ads',{
            title: 'ADS!?!'
        });
    });
});

//edit an ad using its _id
router.get('/edit:_id', function(req,res,next){
   var _id = req.params._id;

   //use mongoose to grab seleted ad to edit
    Ad.findById({ _id: _id}, function(err, ad){
        if (err){
            console.log(err);
            res.render('error');
            return;
        }
        //render ad to edit if good
        res.render('ads/edit', {
            ad: ad,
            title: 'Edit Ad'
        });

    });
});

//post -save updated book
router.post('/edit:_id', function(req,res,nect){
   //grab url id
    var _id = req.params._id;

    //make new ad from the form
    var ad = new Ad({
        _id: _id,
        Title: req.body.Title,
        Description: req.body.Description,
        Price: req.body.Price
    });
    Ad.update({ _id: _id}, ad, function(err) {
        if(err){
            console.log(err);
            res.render('error');
            return;
        }
        res.redirect('/ads',{
            title: 'ADS!?!'
        });
    });
});

//maybe make public who knows
module.exports = router;