import React from 'react';
import { Row, Nav } from "react-bootstrap";

const VideoTypeToggle = ({ onTypeSelect }) => {
    return (
        <Row className="typeToggle">
            <Nav defaultActiveKey="subtitles" onSelect={onTypeSelect}>
                <Nav.Item>
                    <Nav.Link eventKey="subtitles">Subtitles</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="sources">Sources</Nav.Link>
                </Nav.Item>
            </Nav>
        </Row>
    )
}

export default VideoTypeToggle
