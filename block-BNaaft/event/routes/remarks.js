var express = require('express');
var router = express.Router();

var Event = require('../models/event');
var Remark = require('../models/remark')

/* GET users listing. */
router.get('/:id/edit', function(req, res, next) {
  var id = req.params.id;
  Remark.findById(id,(err,remark)=>{
    if (err) return next(err);
    res.render('updateRemark',{remark})
  })
});

router.post('/:id/',(req,res)=>{
    var id = req.params.id;
    Remark.findByIdAndUpdate(id,req.body,(err,updatedremark)=>{
        if (err) return next(err);
        res.redirect('/events/' + updatedremark.eventId)
    })
})
router.get('/:id/delete',(req,res,next)=>{
    var remarkid = req.params.id;
    Remark.findByIdAndDelete(remarkid,(err,deletedremark)=>{
        if (err) return next(err);
        Event.findByIdAndUpdate(deletedremark.eventId,{$pull:{remarks: deletedremark._id}},(err,event)=>{
            if (err) return next(err);
            res.redirect('/events/' + deletedremark.eventId )
        })
    })
})

module.exports = router;