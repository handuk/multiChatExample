const roomManager = require('./roomManager');

exports.setSocketServer = (io) => {

    function removeRoomUser(socket){
        let arrRoomUser = roomUser[socket.user.roomId];
        var idx = arrRoomUser.map(function(e) { 
            return e.dtJoin; 
        }).indexOf(socket.user.dtJoin); 

        if(idx >= 0) roomUser[socket.user.roomId].splice(idx, 1);
        if(roomUser[socket.user.roomId].length == 0) roomManager.removeRoom(socket.user.roomId);
        io.to(socket.user.roomId).emit('updateRoom', arrRoomUser);
        io.to(socket.user.roomId).emit('updateChat', `${socket.user.userName} 님이 퇴장하셨습니다`);
    }

    let roomUser = {};

    io.on('connection', (socket) => {

        socket.on('joinRoom', (userName, roomId) => {
            if(!socket.user){
                socket.user = {
                    userName : userName,
                    roomId : roomId,
                    dtJoin : new Date().getTime()
                };
            }
            console.log("Joining room: " + roomId);
            socket.join(roomId, function() {
                let arrRoomUser = roomUser[roomId];
                if(!arrRoomUser) arrRoomUser = new Array();

                arrRoomUser.push({userName:userName, dtJoin:socket.user.dtJoin})
                roomUser[roomId] = arrRoomUser;

                io.to(socket.user.roomId).emit('updateRoom', arrRoomUser);
                io.to(socket.user.roomId).emit('updateChat', `${socket.user.userName} 님이 입장하셨습니다.`);

            });
        })

        socket.on('updateChat', (message) => {
            io.to(socket.user.roomId).emit('updateChat', `${socket.user.userName} : ${message}`);
        })

        socket.on('leaveRoom', () => {

            if(!socket.user) return;

            socket.leave(socket.user.roomId);

            removeRoomUser(socket);

            socket.emit('leaveRoom');
        })

        socket.on('disconnect', () => {
            if(!socket.user) return;

            removeRoomUser(socket);
        })

    })

}