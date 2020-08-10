import React, { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import axios from "axios";

const VtuberScrollbar = ({ vtuberid, setVtuberId }) => {
    const [Vtubers, setVtubers] = useState([]);
    const [Highlighted, setHighlighted] = useState(vtuberid);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URI}/api/vtubers`)
            .then(res => {
                setVtubers(res.data);
            });
    }, []);

    useEffect(() => {
        setHighlighted(vtuberid);
    }, [vtuberid]);

    const populateVtubers = (vtuber) => {
        return <button key={vtuber._id} 
            className={ (Highlighted === vtuber._id)? 'vtuberSelected' : 'vtuberNotSelected' }
            style={{backgroundImage: `url(${vtuber.avatarURL})`}} 
            onClick={() => { setVtuberId(vtuber._id); }} />
    }

    return (
        <Container>
            <Row className="vtuberScrollbar">
                <button className={'vtuberNotSelected'} onClick={() => { setVtuberId(""); }} >
                    SET FILTER
                </button>
                {Vtubers.map(populateVtubers)}
            </Row>
        </Container>
    )
}

export default VtuberScrollbar;
