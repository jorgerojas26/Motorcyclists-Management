import React, { useState, useEffect } from 'react';

import socket from './socketIO';

export const useRequestScheduleInfo = (initialState) => {
    let [scheduleList, setScheduleList] = useState(initialState);

    useEffect(() => {
        socket.emit('requestScheduleInfo', null, (response) => {
            setScheduleList([...response.scheduleInfo]);
        });
    }, []);

    let listener = (eventName, data) => {
        if (eventName === 'someoneHasSuscribedToASchedule' || eventName === 'someoneHasUnSuscribedFromASchedule') {
            scheduleList.forEach((schedule) => {
                if (schedule.hour == data.hour) {
                    schedule.freeSlots = data.freeSlots;
                }
            });
            setScheduleList([...scheduleList]);
        }
    };

    useEffect(() => {
        socket.onAny(listener);

        return () => {
            socket.offAny(listener);
        };
    }, [scheduleList]);

    return scheduleList;
};
