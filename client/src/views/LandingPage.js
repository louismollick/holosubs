import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Container, Row, Spinner, Col } from "react-bootstrap";

import useInfiniteScroll from "../hooks/useInfiniteScroll";
import VideoTypeToggle from "../components/VideoTypeToggle"
import SourceCard from '../components/SourceCard';
import SubtitleCard from '../components/SubtitleCard';

const LandingPage = ({ vtuberid }) => {
	const [vtuberFilter, setVtuberFilter] = useState("");
	const [pageNumber, setPageNumber] = useState(0);
	const [videoType, setVideoType] = useState("subtitles");

	useEffect(() => {
		setVtuberFilter(vtuberid);
		setPageNumber(0);
	}, [vtuberid])

	const {
		videos,
		hasMore,
		loading,
		error
	} = useInfiniteScroll(videoType, pageNumber, vtuberFilter);

	const observer = useRef();
	const lastVideoElementRef = useCallback(node => {
		if (loading) return;
		if (observer.current) observer.current.disconnect();
		observer.current = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting && hasMore) {
				setPageNumber(prevPageNumber => prevPageNumber + 1);
			}
		});
		if (node) observer.current.observe(node);
	}, [loading, hasMore]);

	const onTypeSelect = (selectedKey) => { 
		setVideoType(selectedKey); 
		setPageNumber(0); 
	}

	const populateVideos = (video, index) => {
		// If last video in batch, put reference on it
		let attributes = { 
			video,
			ref : (videos.length === index + 1) ? lastVideoElementRef : null,
			key :  video._id,
		}; 
		return ( <Col xl={4} lg={5} md={10} xs={20} className="videoCard">
			{ (videoType === "subtitles") ? // chooses correct content for video
				(<SubtitleCard {...attributes} />) :
				(<SourceCard {...attributes} />)
			}
		</Col>);
	};

	return (
		<div>
			<Container fluid className="px-5">
				<VideoTypeToggle onTypeSelect={onTypeSelect}/>
				<Row>
					{videos.map(populateVideos)}
				</Row>
				{
					loading &&
					<Row>
						<Spinner animation="border" role="status" style={{ margin: '3rem auto' }}>
							<span className="sr-only">Loading...</span>
						</Spinner>
					</Row>
				}
				{
					error &&
					<Row>
						Error
          			</Row>
				}
			</Container>
		</div>
	);
};

export default LandingPage;
