import React from 'react';
import { Link } from 'react-router-dom';

const SourceCard = React.forwardRef(({ video }, ref) => {
    return (
        <Link to={`/source/${video._id}`}>
            <div className="videoCardThumbnail">
                <img ref={ref} style={{ width: '100%' }} alt="thumbnail" src={`http://i3.ytimg.com/vi/${video._id}/mqdefault.jpg`} />
                <div>
                    <p> <span>{(video.subtitles) ? video.subtitles.length : null}</span> SUBTITLES<br />AVAILABLE </p>
                </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: video.title }}></div>
        </Link>
    )
});

export default SourceCard;
