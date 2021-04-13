import socket from '../../socketIo/socketIO';

export const onClickHandler = (schedule) => {
    schedule.scheduled = !schedule.scheduled;
    if (schedule.freeSlots != 0) {
        socket.emit('suscribeToSchedule', schedule.hour);
    }
};
