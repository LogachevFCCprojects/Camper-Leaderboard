(function () {
    'use strict';

    var recentCampersUrl = 'https://fcctop100.herokuapp.com/api/fccusers/top/recent';
    var alltimeCampersUrl = 'https://fcctop100.herokuapp.com/api/fccusers/top/alltime';

    var Header = React.createClass({
        displayName: 'Header',

        render: function () {
            var sortby = this.props.sortby;
            return React.createElement(
                'div',
                { className: 'page__title' },
                React.createElement(
                    'h1',
                    null,
                    'Top 100 FreeCodeCamp students'
                ),
                React.createElement(
                    'h2',
                    null,
                    'by\xA0',
                    React.createElement(
                        'span',
                        null,
                        sortby
                    ),
                    ' earned brownie\xA0points'
                ),
                React.createElement(
                    'em',
                    null,
                    'Project by ',
                    React.createElement(
                        'a',
                        { href: 'http://vladimirlogachev.ru', target: '_blank', rel: 'noopener noreferrer' },
                        'Vladimir Logachev'
                    ),
                    '. '
                ),
                React.createElement(
                    'em',
                    null,
                    'Made with React and SASS. ',
                    React.createElement(
                        'a',
                        { href: 'https://github.com/LogachevFCCprojects/Camper-Leaderboard', target: '_blank', rel: 'noopener noreferrer' },
                        'Github'
                    )
                )
            );
        }
    });

    var Camper = React.createClass({
        displayName: 'Camper',

        prettyPlace: function (i) {
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
        prettyDate: function (date1) {
            var date1 = new Date(Date.parse(date1));
            var date2 = new Date();
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            var output = '??';
            if (diffDays === 0) {
                output = 'today';
            }
            if (diffDays === 1) {
                output = 'yesterday';
            }
            if (diffDays > 1) {
                output = diffDays + ' days ago';
            }
            return output;
        },
        render: function () {
            var username = this.props.data.username,
                img = this.props.data.img,
                alltime = this.props.data.alltime,
                recent = this.props.data.recent,
                lastCommit = this.prettyDate(this.props.data.lastUpdate),
                place = this.prettyPlace(this.props.place);
            return React.createElement(
                'tr',
                { className: 'camper' },
                React.createElement(
                    'td',
                    { className: 'camper__info' },
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'a',
                            { className: 'camper__img', href: 'https://www.freecodecamp.com/' + username, target: '_blank', rel: 'noopener noreferrer' },
                            React.createElement('img', { src: img })
                        )
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'a',
                            { className: 'camper__username', href: 'https://www.freecodecamp.com/' + username, target: '_blank', rel: 'noopener noreferrer' },
                            username
                        ),
                        React.createElement(
                            'a',
                            { className: 'camper__more', href: 'https://www.freecodecamp.com/' + username, target: '_blank', rel: 'noopener noreferrer' },
                            'Takes ',
                            place,
                            ' place, last commit ',
                            lastCommit,
                            '.'
                        )
                    )
                ),
                React.createElement(
                    'td',
                    { className: 'camper__recent digits' },
                    recent
                ),
                React.createElement(
                    'td',
                    { className: 'camper__alltime digits' },
                    alltime
                )
            );
        }
    });

    var CamperLeaderboardApp = React.createClass({
        displayName: 'CamperLeaderboardApp',

        callRecent: function (e) {
            e.preventDefault();
            e.stopPropagation();
            getObjectFromURL(recentCampersUrl, renderRecent);
        },
        callAlltime: function (e) {
            e.preventDefault();
            e.stopPropagation();
            getObjectFromURL(alltimeCampersUrl, renderAlltime);
        },
        render: function () {
            var sortby = this.props.sortby,
                items = this.props.data;
            var itemsTemplate;

            if (items.length > 0) {
                itemsTemplate = items.map(function (item, index) {
                    return React.createElement(Camper, { place: index + 1, data: item, key: index });
                });
            } else {
                itemsTemplate = React.createElement(
                    'p',
                    null,
                    'No items presented on the source'
                );
            }

            return React.createElement(
                'section',
                null,
                React.createElement(Header, { sortby: sortby }),
                React.createElement(
                    'table',
                    { className: 'allcampers' },
                    React.createElement(
                        'thead',
                        { className: 'allcampers__heading' },
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                null,
                                'Student\'s username'
                            ),
                            React.createElement(
                                'th',
                                { className: 'digits' },
                                React.createElement(
                                    'a',
                                    { href: '#', onClick: this.callRecent },
                                    'Recent'
                                )
                            ),
                            React.createElement(
                                'th',
                                { className: 'digits' },
                                React.createElement(
                                    'a',
                                    { href: '#', onClick: this.callAlltime },
                                    'All-time'
                                )
                            )
                        )
                    ),
                    React.createElement(
                        'tbody',
                        { className: 'allcampers__body' },
                        itemsTemplate
                    )
                )
            );
        }
    });

    var renderRecent = function (initialArray) {
        initialArray.sort(function (a, b) {
            return b.recent - a.recent;
        });
        ReactDOM.render(React.createElement(CamperLeaderboardApp, { sortby: 'recently', data: initialArray }), document.getElementById('root'));
    };

    var renderAlltime = function (initialArray) {
        initialArray.sort(function (a, b) {
            return b.alltime - a.alltime;
        });
        ReactDOM.render(React.createElement(CamperLeaderboardApp, { sortby: 'all-time', data: initialArray }), document.getElementById('root'));
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
})();