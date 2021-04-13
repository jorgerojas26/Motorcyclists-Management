require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    },
});

app.use(cors());
app.options('*', cors());

let schedules = require('./schedules.json');

const userOnSchedule = (schedule, userId) => {
    let exists = false;
    schedule.usersId.map((id) => {
        if (id == userId) {
            exists = true;
            unSuscribeFromSchedule(schedule.hour, userId);
        }
    });

    return exists;
};

const removeUserFromSchedule = (userId) => {
    for (let schedule of schedules) {
        if (schedule.usersId && schedule.usersId.length) {
            schedule.usersId = schedule.usersId.filter((id) => id != userId);
            io.to('motorcyclists').emit('someoneHasUnSuscribedFromASchedule', {
                hour: schedule.hour,
                freeSlots: process.env.MAX_MOTORCICLISTS_PER_SCHEDULE - schedule.usersId.length,
            });
        }
    }
};

const suscribeToSchedule = (hour, userId) => {
    schedules.map((schedule) => {
        if (schedule.hour == hour) {
            if (schedule.usersId.length != process.env.MAX_MOTORCICLISTS_PER_SCHEDULE) {
                schedule.usersId.push(userId);

                let freeSlots = process.env.MAX_MOTORCICLISTS_PER_SCHEDULE - schedule.usersId.length;

                io.to('motorcyclists').emit('someoneHasSuscribedToASchedule', { hour, freeSlots });
            }
        }
    });
};

const unSuscribeFromSchedule = (hour, userId) => {
    schedules.map((schedule) => {
        if (schedule.hour == hour) {
            schedule.usersId = schedule.usersId.filter((id) => id != userId);

            io.to('motorcyclists').emit('someoneHasUnSuscribedFromASchedule', {
                hour,
                freeSlots: process.env.MAX_MOTORCICLISTS_PER_SCHEDULE - schedule.usersId.length,
            });
        }
    });
};

io.on('connection', (socket) => {
    socket.join('motorcyclists');

    socket.on('suscribeToSchedule', (hour, callback) => {
        let schedule = schedules.filter((schedule) => schedule.hour == hour)[0];

        if (userOnSchedule(schedule, socket.id)) {
            return;
        }

        if (schedule.length == process.env.MAX_MOTORCICLISTS_PER_SCHEDULE) {
            return;
        }

        suscribeToSchedule(hour, socket.id);
    });

    socket.on('unsuscribeFromSchedule', (hour, callback) => {
        let schedule = schedules.filter((schedule) => schedule.hour == hour)[0];

        unSuscribeFromSchedule(hour, socket.id);

        callback({ success: true });
    });

    socket.on('requestScheduleInfo', (data, callback) => {
        let scheduleInfo = [];
        for (let schedule of schedules) {
            let freeSlots = process.env.MAX_MOTORCICLISTS_PER_SCHEDULE - schedule.usersId.length;
            scheduleInfo.push({ hour: schedule.hour, freeSlots });
        }
        callback({ scheduleInfo });
    });

    socket.on('disconnect', () => {
        removeUserFromSchedule(socket.id);
    });
});

server.listen(process.env.SERVER_PORT, '127.0.0.1', () => {
    console.log(`Example app listening at http://localhost:${process.env.SERVER_PORT}`);
});
