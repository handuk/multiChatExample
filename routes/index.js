var express = require('express');
var router = express.Router();
const roomManager = require('../modules/roomManager');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/list', function(req, res, next) {
  if(!req.query.userName){
    res.redirect(`/`);
  }else{
    res.render('listRoom', {listRoom: roomManager.getListRoom(), userName: req.query.userName});
  }
});

router.post('/room', function(req,res,next){

  
  let roomInfo;
  
  if(req.body.mode == 'add'){
    roomInfo = roomManager.addRoom(req.body.roomName, req.body.userName);
  }else{
    roomInfo = {roomName: req.body.roomName, userName:req.body.userName, roomId:req.body.roomId}
  }
  
  if(roomManager.getListRoom().size == 0 || !roomManager.getListRoom().has(roomInfo.roomId)) {
    res.redirect(`/list?userName=${req.body.userName}`);
  }else{
    res.render('chatRoom', roomInfo);
  }
})


module.exports = router;
