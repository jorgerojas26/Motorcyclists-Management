import styled from 'styled-components';

export const StyledTable = styled.table`
    width: 100%;
    font-size: 25px;
    text-align: center;
`;

export const THead = styled.thead`
    background-color: #aaa;
    border: 1px outset black;
`;

export const TFoot = styled.tfoot`
    // custom css goes here
`;

export const TBody = styled.tbody``;

export const TR = styled.tr`
    background-color: #eee;
    border: 1px inset grey;
    background-color: ${(props) => (props.scheduled ? '#3CB371' : props.freeSlots ? 'white' : props.freeSlots == null ? 'grey' : 'red')};
    color: ${(props) => (props.scheduled || !props.freeSlots ? 'white' : 'black')};
    cursor: 'pointer';
`;

export const TH = styled.th`
    border-left: 1px solid black;
    border-right: 1px solid black;
`;

export const THChildrenWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const TD = styled.td`
    border-left: 1px solid grey;
    border-right: 1px solid grey;
    padding: 5px;
`;
