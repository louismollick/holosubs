import React from 'react';

const SourceCard = React.forwardRef(({ video }, ref) => {
    return (
        <div>
            <a href={`https://www.youtube.com/watch?v=${video._id}`} target="_blank" rel="noopener noreferrer" className="videoCardThumbnail">
            <img ref={ref} style={{ width: '100%' }} alt="thumbnail" src={`http://i3.ytimg.com/vi/${video._id}/mqdefault.jpg`} />
            <div className="videoCardBox">
                <p> <span>{(video.subtitles) ? video.subtitles.length : null}</span> SUBTITLES<br />AVAILABLE </p>
            </div>
            </a>
            <div dangerouslySetInnerHTML={{ __html: video.title }}></div>
        </div>
        
    )
});

export default SourceCard;
