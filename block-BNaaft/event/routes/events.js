var express = require('express');
const Event = require('../models/event');
var router = express.Router();
var Remark = require('../models/remark')

/* GET users listing. */

router.get('/form',(req,res)=>{
  res.render('eventForm')
})


router.post('/form',(req,res,next)=>{
  Event.create(req.body,(err,createdevent)=>{
    if (err) return next(err);
    res.redirect('/events')
  })
});
router.get('/',(req,res,next)=>{
  // console.log(req.query);
  var{category,location,startDate,endDate} = req.query;
  var query = {};
  if(category){
    query.category = category;
  }
  if(location){
    query.location = location;
  }
  if(startDate && endDate){
    query.startDate = {$gte: startDate};
    query.endDate = {$lte: endDate}
  }
  Event.find(query,(err,event)=>{
    if (err) return next(err);
    Event.distinct('category',(err, category)=>{
      if (err) return next(err);
      Event.distinct('location',(err,location)=>{
        if (err) return next(err);
        Event.distinct('startDate',(err,startDate)=>{
          if (err) return next(err);
          Event.distinct('endDate',(err,endDate)=>{
            if (err) return next(err);
            res.render('eventlist',{event,location,category});
              console.log(event,category,location,startDate,endDate)
          })
        })
      })
    })
  })
});


// event details



// router.get('/:id',(req,res,next)=>{
//   var id = req.params.id;
//   Event.findById(id,(err,event)=>{
//     if (err) return next(err);
//     Remark.find({eventId: id},(err,remarks)=>{
//       res.render('eventDetails',{event,remarks})
//     })
//   })
// })

router.get('/:id',(req,res,next)=>{
  var id = req.params.id;
  Event.findById(id).populate('remarks').exec((err,event)=>{
    console.log(err,event);
    if (err) return next(err);
    res.render('eventDetails',{event})
  })
})

// increment likes

router.get('/:id/likes',(req,res,next)=>{
  var id = req.params.id;
  Event.findByIdAndUpdate(id,{$inc: {likes: 1}},(err,event)=>{
    if (err) return next(err);
    res.redirect('/events/' + id)
  })
})

// edit and delete

router.get('/:id/edit',(req,res,next)=>{
  var id = req.params.id;
  Event.findById(id,(err,event)=>{
    if (err) return next(err);
    res.render('editEvent',{event:event})
  })
})

router.post('/:id',(req,res)=>{
  var id = req.params.id;
  Event.findByIdAndUpdate(id,req.body,(err,updatedevent)=>{
    if (err) return next(err);
    res.redirect('/events/' +id)
  })
});



router.get('/:id/delete',(req,res)=>{
  var id = req.params.id;
  Event.findByIdAndDelete(id,(err,event)=>{
    if (err) return next(err);
    Remark.deleteMany({eventId: event.id},(err,info)=>{
      if (err) return next(err);
      res.redirect('/events' )
    })
  })
})

// add remarks

router.post('/:id/remarks',(req,res,next)=>{
  var id = req.params.id;
  req.body.eventId = id;
  Remark.create(req.body,(err,remark)=>{
    if (err) return next(err);
    Event.findByIdAndUpdate(id,{$push : { remarks: remark._id}}, (err,updatedevent)=>{
      if (err) return next(err);
      res.redirect('/events/'+ id)
    })
    
  })
})



module.exports = router;
