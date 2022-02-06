//returns room name and length as properties with values
const getRoomSpecs = (roomEntries, roomName) => {
    let obj = {
        roomName: roomName,
        socketNames: [],
        roomSize: 0,
    }
    let valueSetOfRoom = undefined;

    for (let [key, value] of roomEntries) {
        if (key === obj.roomName) {
            valueSetOfRoom = value;
            obj.roomSize = value.size;
            break;
        }
        
    }
    if (valueSetOfRoom !== undefined){ //first log 
        valueSetOfRoom.forEach(element => {
            obj.socketNames.push(element);
        });
    }
    return obj;
   
};

module.exports = { getRoomSpecs };