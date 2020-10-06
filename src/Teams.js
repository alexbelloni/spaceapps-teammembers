import React from 'react';
import './Teams.css';
import locationImg from './images/location.png';

const Team = (props) => {
    const { index, teamName, location, url, category, challenge, updated, positions } = props.info;

    return (
        <article className="team" id={index}>
            <span className="name">{teamName}</span>
            <span className="category">{category}</span>
            <span className="challenge">{challenge}</span>
            <div><img className="pinpoint" alt="" src={locationImg} /><span className="location">{location}</span></div>

            {positions && <div className="positions">
                <span>{positions}</span>
            </div>}
            
            <a className="detail-btn" href={url} target="_blank" rel="noopener noreferrer">details</a>
            {updated && <div className="updatedDate">
                <span>{updated}</span>
            </div>}
        </article>
    )
}

const Teams = (props) => {
    return (
        <div className="teams">
            {props.teams.map((t, i) => {
                return <Team key={i} info={t} />
            })}
        </div>
    )
}

export default Teams;