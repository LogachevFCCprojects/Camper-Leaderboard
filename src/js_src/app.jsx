var Header = React.createClass({
    render: function() {
        return (
            <div>
                {/*<h1>Top 100 campers</h1>
                <em>Vladimir Logachev. FCC. Github.</em>*/}
            </div>
            )
    }
});

var Camper = React.createClass({
    render: function() {
        var username = this.props.data.username,
            img = this.props.data.img,
            alltime = this.props.data.alltime,
            recent = this.props.data.recent,
            lastUpdate = this.props.data.lastUpdate;
        return (
            <tr className="camper">
                <td className="camper__info" >
                    <div>
                        <a className="camper__img" href={'https://www.freecodecamp.com/' + username}>
                            <img src={img}/ >
                        </a>
                    </div>
                    <div>
                        <a className="camper__username" href={'https://www.freecodecamp.com/' + username}>{username}</a>
                        <a className="camper__more" href={'https://www.freecodecamp.com/' + username}>
                            On NN'nd place, last commit DD days ago (today)
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
    render: function() {
        var settings = {author: 1, location: 0},
        items = this.props.data;
        var itemsTemplate;

        if (items.length > 0) {
            itemsTemplate = items.map(function(item, index) {
                return (
                    <Camper data={item} key={index} />
                    )
            })
        } else {
            itemsTemplate = <p>No items presented on the source</p>
        }

        return (
            <section>
            <Header data={settings}/>
            <table className="allcampers">
                <thead className="allcampers__heading">
                    <tr>
                        <th>User</th>
                        <th className="digits">Recent</th>
                        <th className="digits">All-time</th>
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
            console.warn(response);
            console.error(err);
        }
    };
    xhr.send();
};

var recentCampersUrl = 'https://fcctop100.herokuapp.com/api/fccusers/top/recent';
var alltimeCampersUrl = 'https://fcctop100.herokuapp.com/api/fccusers/top/alltime';

getObjectFromURL(alltimeCampersUrl, renderAll);

