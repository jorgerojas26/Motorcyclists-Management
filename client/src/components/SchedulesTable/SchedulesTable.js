import React from 'react';
import { MdWatchLater } from 'react-icons/md';
import { FaMotorcycle } from 'react-icons/fa';
import { GrStatusGood } from 'react-icons/gr';

import { Table } from '../SchedulesTable';

import { onClickHandler } from './SchedulesTableContainer';

import { useRequestScheduleInfo } from '../../socketIo/socketIo-utils';

const SchedulesTable = () => {
    let scheduleList = useRequestScheduleInfo([]);

    return (
        <Table>
            <Table.Head>
                <Table.TR>
                    <Table.TH>
                        <MdWatchLater />
                        Horario
                    </Table.TH>
                    <Table.TH>
                        <FaMotorcycle />
                        Motociclistas Solicitados
                    </Table.TH>
                    <Table.TH>
                        <GrStatusGood />
                        Estado
                    </Table.TH>
                </Table.TR>
            </Table.Head>
            <Table.Body>
                {scheduleList &&
                    scheduleList.map((schedule) => {
                        return (
                            <Table.TR
                                scheduled={schedule.scheduled}
                                key={schedule.hour}
                                freeSlots={schedule.freeSlots}
                                onClick={() => onClickHandler(schedule)}
                            >
                                <Table.TD>{schedule.hour}</Table.TD>
                                <Table.TD>{schedule.freeSlots}</Table.TD>
                                <Table.TD>{schedule.scheduled ? 'Solicitado' : schedule.freeSlots ? 'Disponible' : 'No disponible'}</Table.TD>
                            </Table.TR>
                        );
                    })}
            </Table.Body>
        </Table>
    );
};

export default SchedulesTable;
