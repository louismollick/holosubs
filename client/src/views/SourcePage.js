import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Container, Row, Spinner } from "react-bootstrap";
import axios from "axios";

import SubtitleCard from '../components/SubtitleCard';

const SourcePage = () => {
    const [video, setVideo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URI}/api/sources/${id}`)
            .then(res => {
                setVideo(res.data[0]);
            })
            .catch(error => setError(error))
            .finally(e => setLoading(false));
    }, []);

    return (
        <Container>
            <Row>
                {video?.subtitles?.map((video) => {
                    console.log('video', video);
                    return <SubtitleCard key={video._id} video={video} />
                })}
            </Row>
            {
                loading &&
                <Row>
                    <Spinner animation="border" role="status" style={{ margin: '3rem auto' }}>
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </Row>
            }
            { error && <Row>Error</Row> }
        </Container>
    )
}

export default SourcePage;
