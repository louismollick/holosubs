import React from 'react';

const SubtitleCard = React.forwardRef(({ video }, ref) => {
    return (
        <a href={`https://www.youtube.com/watch?v=${video._id}`} target="_blank" rel="noopener noreferrer">
            <img ref={ref} style={{ width: '100%' }} alt="thumbnail" src={`http://i3.ytimg.com/vi/${video._id}/mqdefault.jpg`} />
            <div dangerouslySetInnerHTML={{ __html: video.title }}></div>
        </a>
    )
});

export default SubtitleCard;
