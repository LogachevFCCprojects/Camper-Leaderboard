var Settings = React.createClass({
    render: function() {
        return (
            <header>
            <h1>Camper Leaderboard</h1>
            <em>Vladimir Logachev. FCC. Github.</em>
            </header>
            )
    }
});

var SingleItem = React.createClass({
    render: function() {
        var username = this.props.data.username,
            img = this.props.data.img,
            alltime = this.props.data.alltime,
            recent = this.props.data.recent,
            lastUpdate = this.props.data.lastUpdate;
        return (
            <div className="camper">
                <div className="camper__img"><img src={img}/></div>
                <div>
                    <a href={'https://www.freecodecamp.com/' + username} className="camper__username">{username}</a>
                    <p className="camper__lastupdate">{lastUpdate}</p>
                </div>
                <div className="camper__alltime">{alltime}</div>
                <div className="camper__recent">{recent}</div>
            </div>
            )
    }
});

var CamperLeaderboardApp = React.createClass({
    render: function() {
        var settings = {author: 1, location: 0},
        items = this.props.data;
        var itemsTemplate;

        if (items.length > 0) {
            itemsTemplate = items.map(function(item, index) {
                return (
                    <SingleItem data={item} key={index} />
                    )
            })
        } else {
            itemsTemplate = <p>No items presented on the source</p>
        }

        return (
            <section>
            <Settings data={settings}/>
            <ul className="all_campers">
            {itemsTemplate}
            </ul>
            </section>
            );
    }
});

var renderAll = function (obj) {
  ReactDOM.render(
    <CamperLeaderboardApp data={obj} />,
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
            console.warn('That\'s not a proper JSON.');
            console.warn(response);
        }
    };
    xhr.send();
};

var recentCampersUrl = 'https://fcctop100.herokuapp.com/api/fccusers/top/recent';
var alltimeCampersUrl = 'https://fcctop100.herokuapp.com/api/fccusers/top/alltime';

getObjectFromURL(alltimeCampersUrl, renderAll);

