import React from 'react';
import './Filter.css';

const Filter = (props) => {
    function createOptions(defaultCaption, items) {
        const options = [<option key="0">{defaultCaption}</option>]
        if (items) {
            items.forEach(c => {
                options.push(<option key={c}>{c}</option>)
            });
        }
        return options;
    }

    const filterElements = [
        ["locationSelector", "-- Select a Location --", "locationSelect"],
        ["categorySelector", "-- Select a Category --", "categorySelect"],
        ["challengeSelector", "-- Select a Challenge --", "challengeSelect"],
        ["positionSelector", "", "positionSelect"],
    ]

    function changeElement(id) {
        filterElements.filter(e => e[0] !== id).forEach(e => {
            const element = document.querySelector(`#${e[0]}`);
            if (element) {
                element.value = e[1];
            }
        })
        props[filterElements.find(e => e[0] === id)[2]](document.querySelector(`#${id}`).value);
    }
    
    return (
        <div className="filter">
            { props.locations.length > 1 &&
                <select id='locationSelector' onChange={() => changeElement('locationSelector')}>
                    {createOptions("-- Select a Location --", props.locations)}
                </select>}
            <select id='categorySelector' onChange={() => changeElement('categorySelector')}>
                {createOptions("-- Select a Category --", props.categories)}
            </select>
            <select id='challengeSelector' onChange={() => changeElement('challengeSelector')}>
                {createOptions("-- Select a Challenge --", props.challenges)}
            </select>
            <input id='positionSelector' placeholder="-- Enter a Skill --" onChange={() => changeElement('positionSelector')} />
        </div>
    )
}

export default Filter;