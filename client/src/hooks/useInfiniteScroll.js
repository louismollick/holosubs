import { useEffect, useState } from "react";
import axios from "axios";

const useInfiniteScroll = (type, pageNumber, vtuber) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [videos, setVideos] = useState([]);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		setVideos([]);
	}, [type,vtuber]);

	useEffect(() => {
		setLoading(true);
		setError(false);
		let cancel;
		axios({
			method: "GET",
			url: `${process.env.REACT_APP_API_URI}/api/${type}/`,
			params: {
				vtuberid: vtuber,
				page: pageNumber,
			},
			cancelToken: new axios.CancelToken((c) => (cancel = c)),
		})
			.then((res) => {
				setVideos((prevVideos) => {
					return [
						...prevVideos, ...res.data.items,
					];
				});
				setHasMore(res.data.items.length > 0);
				setLoading(false);
			})
			.catch((e) => {
				if (axios.isCancel(e)) return setError(true);
			});
		return () => cancel();
	}, [type, pageNumber, vtuber]);

	return {
		loading,
		error,
		videos,
		hasMore,
	};
};

export default useInfiniteScroll;
