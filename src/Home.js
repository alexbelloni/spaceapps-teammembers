import React from 'react';
import FirebaseAccess from './database/FirebaseAccess';
import Filter from './Filter';
import Teams from './Teams';
import './Home.css';
import logo from './images/logo.png';
import loading from './images/loading.gif';
import heart from './images/heart.png';

class Home extends React.Component {
    state = { teams: [], teamsSelected: [], locations: [], loading: false };

    componentDidMount() {
        //UPDATE TEAM / POSITIONS
        //FirebaseAccess.updatePositions("Interstellar","mechanics, design, anyone of them."); return;
        //CREATE TEAM / POSITIONS
        // FirebaseAccess.addTeam({
        //     location:"/locations/universal-event",
        //     lookingForMembers: true, 
        //     teamName:"/challenges/create/lets-connect/teams/spacecraft-zima", 
        //     positions: "",
        //     updated:"2020-09-30 22:46", 
        //     url:"/challenges/create/lets-connect/teams/spacecraft-zima",
        // }); return;

        const me = this
        me.setState({ loading: true }, () => {
            FirebaseAccess.getTeams().then(teams => {
                function getLocation(str) {
                    const arr = str.split('/');
                    return arr[arr.length - 1];
                }

                function getCategory(str) {
                    const arr = str.split('/');
                    return arr[2];
                }

                function getChallenge(str) {
                    const arr = str.split('/');
                    return arr[3];
                }

                function getReducedList(ExtractAttrfunction, attrName){
                    return teams.map(t => ExtractAttrfunction(t[attrName])).reduce((acc, current) => {
                        if (!acc.includes(current)) {
                            acc.push(current);
                        }
                        return acc;
                    }, []).sort();
                }

                const locations = getReducedList(getLocation, 'location');
                const categories = getReducedList(getCategory, 'url');
                const challenges = getReducedList(getChallenge, 'url');

                function getName(str) {
                    const arr = str.split('/');
                    return arr[arr.length - 1];
                }

                function getUrl(str) {
                    return `https://2020.spaceappschallenge.org${str}/members`
                }

                const formattedTeams = teams.map((t,index) => {
                    return {
                        index,
                        teamName: getName(t.teamName),
                        location: getLocation(t.location),
                        url: getUrl(t.url),
                        category: getCategory(t.url),
                        challenge: getChallenge(t.url),
                        updated: t.updated,
                        positions: t.positions || ""
                    }
                }).sort((a, b) => {
                    if (a.teamName < b.teamName) {
                        return -1;
                    }
                    if (a.teamName > b.teamName) {
                        return 1;
                    }
                    return 0;
                })

                me.setState({ teams: formattedTeams, teamsSelected: formattedTeams, locations, categories, challenges, loading: false })
            }).catch(e => {
                console.log(e)
                me.setState({ error: e, loading: false })
            })

        })
    }

    locationSelect(name) {
        this.setState({ teamsSelected: this.state.teams.filter(t => t.location.indexOf(name) > -1), })
    }

    categorySelect(name) {
        this.setState({ teamsSelected: this.state.teams.filter(t => t.category.indexOf(name) > -1), })
    }

    challengeSelect(name) {
        this.setState({ teamsSelected: this.state.teams.filter(t => t.challenge.indexOf(name) > -1), })
    }
    positionSelect(name) {
        this.setState({ teamsSelected: this.state.teams.filter(t => t.positions.indexOf(name) > -1), })
    }

    render() {
        return (
            <div className="home">
                <h2><img className="logo" alt="" src={logo} />Mural of Positions</h2>
                <h3>Find a Space Apps Team</h3>
                <div className="tell-me"><span>or</span> <a href="https://chat.spaceappschallenge.org/direct/alexbelloni" target="_blank" rel="noopener noreferrer">If you need members, tell me about skills required!</a></div>
                {!this.state.loading && <Filter locations={this.state.locations} categories={this.state.categories} challenges={this.state.challenges}
                    locationSelect={e => { this.locationSelect(e) }} categorySelect={e => { this.categorySelect(e) }} challengeSelect={e => { this.challengeSelect(e) }}
                    positionSelect={e => { this.positionSelect(e) }} />}
                <h4>Teams looking for Members:</h4>
                <span className="total"><span className="number-of-teams">{this.state.teams.length}</span> teams in {this.state.locations.length === 1 ? this.state.locations[0] : `${this.state.locations.length} locations`}</span>
                {this.state.loading && <div className="loading-div"><img alt="" src={loading} className="loading" /></div>}
                <Teams teams={this.state.teamsSelected} />
                <footer>
                    <span>NASA Space Apps Challenge 2020 - October 2-4</span>
                    <span>created <img className="heart" alt="" src={heart}/> by <a href="https://nasadatanauts.github.io/alexbelloni/" target="_blank" rel="noopener noreferrer">alexbelloni</a> NASA Space Apps Ambassador</span>
                    </footer>
            </div>
        )
    }
}

export default Home;