let eventList = [];

let isEmit = false;
let offEvents = [];

module.exports = {
    on: function(name, cb) {
        let event = {
            name,
            cb
        };
        eventList.push(event);
        return event;
    },
    emit: function(name, ...args) {
        // [NOTICE] multi-Progress call
        isEmit = true;
        eventList.forEach((event)=>{
            event.name === name && event.cb && event.cb(...args);
        });
        isEmit = false;

        while (offEvents.length) {
            off(offEvents[0]);
            offEvents.shift();
        }
    },
    off: function(event) {
        if (isEmit) {
            offEvents.push(event);
            return;
        }
        off(event);
    }
};

function off(event) {
    if (!event) {
        return;
    }

    let i;
    for (i = 0; i<eventList.length; i++) {
        if (event === eventList[i]) {
            break;
        }
    }

    i !== eventList.length && eventList.splice(i, 1);
}