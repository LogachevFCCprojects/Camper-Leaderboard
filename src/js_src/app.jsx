(function () {
    'use strict';

    var recentCampersUrl = 'https://fcctop100.herokuapp.com/api/fccusers/top/recent';
    var alltimeCampersUrl = 'https://fcctop100.herokuapp.com/api/fccusers/top/alltime';

    var Header = React.createClass({
        render: function() {
            var sortby = this.props.sortby;
            return (
                <div className="page__title">
                    <h1>Top 100 FreeCodeCamp students</h1>
                    <h2>by&nbsp;<span>{sortby}</span> earned brownie&nbsp;points</h2>

                    <em>Project by <a href="http://vladimirlogachev.ru" target="_blank" rel="noopener noreferrer">Vladimir Logachev</a>. </em>
                    <em>Made with React and SASS. <a href="https://github.com/LogachevFCCprojects/Camper-Leaderboard" target="_blank" rel="noopener noreferrer">Github</a></em>
                </div>
                )
        }
    });

    var Camper = React.createClass({
        prettyPlace: function(i) {
            var j = i % 10,
                k = i % 100;
            if (j === 1 && k !== 11) {
                return i + "st";
            }
            if (j === 2 && k !== 12) {
                return i + "nd";
            }
            if (j === 3 && k !== 13) {
                return i + "rd";
            }
            return i + "th";
        },
        prettyDate: function(date1) {
            var date1 = new Date(Date.parse(date1));
            var date2 = new Date();
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
            var output = '??';
            if (diffDays === 0) {
                output = 'today'
            }
            if (diffDays === 1) {
                output = 'yesterday'
            }
            if (diffDays > 1) {
                output = diffDays+' days ago'
            }
            return output;
        },
        render: function() {
            var username = this.props.data.username,
                img = this.props.data.img,
                alltime = this.props.data.alltime,
                recent = this.props.data.recent,
                lastCommit = this.prettyDate(this.props.data.lastUpdate),
                place = this.prettyPlace(this.props.place);
            return (
                <tr className="camper">
                    <td className="camper__info" >
                        <div>
                            <a className="camper__img" href={'https://www.freecodecamp.com/' + username} target="_blank" rel="noopener noreferrer">
                                <img src={img}/>
                            </a>
                        </div>
                        <div>
                            <a className="camper__username" href={'https://www.freecodecamp.com/' + username} target="_blank" rel="noopener noreferrer">{username}</a>
                            <a className="camper__more" href={'https://www.freecodecamp.com/' + username} target="_blank" rel="noopener noreferrer">
                                Takes {place} place, last commit {lastCommit}.
                            </a>
                        </div>
                    </td>
                    <td className="camper__recent digits" >{recent}</td>
                    <td className="camper__alltime digits" >{alltime}</td>
                </tr>
                )
        }
    });

    var CamperLeaderboardApp = React.createClass({
        callRecent: function(e) {
            e.preventDefault();
            e.stopPropagation();
            getObjectFromURL(recentCampersUrl, renderRecent);
        },
        callAlltime: function(e) {
            e.preventDefault();
            e.stopPropagation();
            getObjectFromURL(alltimeCampersUrl, renderAlltime);
        },
        render: function() {
            var sortby = this.props.sortby,
                items = this.props.data;
            var itemsTemplate;

            if (items.length > 0) {
                itemsTemplate = items.map(function(item, index) {
                    return (
                        <Camper place={index+1} data={item} key={index} />
                        )
                })
            } else {
                itemsTemplate = <p>No items presented on the source</p>
            }

            return (
                <section>
                <Header sortby={sortby}/>
                <table className="allcampers">
                    <thead className="allcampers__heading">
                        <tr>
                            <th>Student's username</th>
                            <th className="digits">
                                <a href="#" onClick={this.callRecent}>Recent</a>
                            </th>
                            <th className="digits">
                                <a href="#" onClick={this.callAlltime}>All-time</a>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="allcampers__body">
                        {itemsTemplate}
                    </tbody>
                </table>
                </section>
                );
        }
    });

    var renderRecent = function (initialArray) {
        initialArray.sort(function (a, b) {
            return b.recent - a.recent;
        });
        ReactDOM.render(
        <CamperLeaderboardApp sortby={'recently'} data={initialArray} />,
        document.getElementById('root')
        );
    };

    var renderAlltime = function (initialArray) {
        initialArray.sort(function (a, b) {
            return b.alltime - a.alltime;
        });
        ReactDOM.render(
        <CamperLeaderboardApp sortby={'all-time'} data={initialArray} />,
        document.getElementById('root')
        );
    };

    var getObjectFromURL = function (url, callback) {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
        xhr.onreadystatechange = function () {
            var status = xhr.status,
            response = xhr.responseText;
            newObject = {};

            if (xhr.readyState !== 4) {
                return false;
            }

            if (status !== 200) {
                console.warn('Error, status code: ' + status);
                return false;
            }
            
            try {
                var newObject = JSON.parse(response);
                console.info('We got object!');
                console.info(newObject);
                callback(newObject);
            } catch (err) {
                console.warn(response);
                console.error(err);
            }
        };
        xhr.send();
    };

    getObjectFromURL(recentCampersUrl, renderRecent);

}());