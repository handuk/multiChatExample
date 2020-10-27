const randomString = require('randomstring');

let listRoom = new Map();

class RoomManager{

    addRoom(roomName, userName){
        let dt = new Date().getTime();
        let roomId = randomString.generate(5)+dt;
        listRoom.set(roomId, {
            roomName : roomName,
            roomMaster : userName
        })

        return {roomName: roomName, roomId:roomId, userName:userName};
    }

    getListRoom(){
        return listRoom;
    }

    removeRoom(roomId){
        listRoom.delete(roomId);
    }


}
module.exports = new RoomManager();
