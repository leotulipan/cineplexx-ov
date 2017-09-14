var _ = require('lodash');
let request = require('request')
// https://github.com/cheeriojs/cheerio
let cheerio = require('cheerio')
let film = []
let fs = require('fs')
let today = new Date().toJSON().slice(0, 10)
let dates = Array();

// Based on https://stackoverflow.com/a/8486188/1440255
function getJsonFromUrl(url = location.href, hashBased = true) {
    var query;
    if (hashBased) {
        var pos = url.indexOf("?");
        if (pos == -1) return [];
        query = url.substr(pos + 1);
    } else {
        query = url.substr(1);
    }
    var result = {};
    query.split("&").forEach(function (part) {
        if (!part) return;
        part = part.split("+").join(" "); // replace every + with space, regexp-free version
        var eq = part.indexOf("=");
        var key = eq > -1 ? part.substr(0, eq) : part;
        var val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : "";
        var from = key.indexOf("[");
        if (from == -1) result[decodeURIComponent(key)] = val;
        else {
            var to = key.indexOf("]", from);
            var index = decodeURIComponent(key.substring(from + 1, to));
            key = decodeURIComponent(key.substring(0, from));
            if (!result[key]) result[key] = [];
            if (!index) result[key].push(val);
            else result[key][index] = val;
        }
    });
    return result;
}


let centerId = {
    6: 'Actors Studio',
    8: 'Apollo - Das Kino',
    2: 'Artis International',
    79: 'Cineplexx Amstetten',
    75: 'Cineplexx Donau Plex',
    73: 'Cineplexx Graz',
    28: 'Cineplexx Hohenems',
    24: 'Cineplexx Innsbruck',
    81: 'Cineplexx Lauterach',
    76: 'Cineplexx Leoben',
    20: 'Cineplexx Linz',
    117: 'Cineplexx Mattersburg',
    30: 'Cineplexx Salzburg Airport',
    29: 'Cineplexx Salzburg City',
    78: 'Cineplexx Spittal',
    27: 'Cineplexx Villach',
    25: 'Cineplexx Wien Auhof',
    105: 'Cineplexx Wiener Neustadt',
    74: 'Cineplexx Wienerberg',
    77: 'Cineplexx Wörgl',
    59: 'Filmtheater Kitzbühel',
    15: 'Geidorf Kunstkino',
    26: 'Stadtkino Villach',
    7: 'Urania Kino',
    115: 'Village Cinema Wien Mitte ',
}

// let OVcenter = [6, 8, 2, 75, 115]
let OVcenter = [2]

request('http://www.cineplexx.at/service/program.php?type=program&centerId=2&date=' + today + '&originalVersionTypeFilter=OV&sorting=alpha&undefined=Alle&view=detail',
    // Get all available dates from the #date dropdown
    function (error, response, body) {
        // console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        const $ = cheerio.load(body)

        $("[name=date] > option").each(function (i, el) {
            // console.log("date: '" + $(this).val() + "'")
            if ($(this).val())
                dates.push($(this).val())
        })
    })

// dates is not set here, because async - refactor into a TS class
dates = ['2017-09-14']
dates.forEach(function (date) {
    OVcenter.forEach(function (center) {
        request('http://www.cineplexx.at/service/program.php?type=program&centerId=' + center + '&date=' + date + '&originalVersionTypeFilter=OV&sorting=alpha&undefined=Alle&view=detail',
            function (error, response, body) {
                if (error)
                    console.log('Request error: ', error)
                // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                const $ = cheerio.load(body)

                namesOV = Array()
                movieId = Array()
                times = Array()
                movie = Array()


                // DE names = $("div.detailview-element div.info h2 a").text()

                $("div.overview-element").map(function (i, el) {
                    id = $(this).data("mainid")
                    genreIds = $(this).data("genre")
                    techId = $(this).data("technology")
                    name = $(this).find(".three-lines p").eq(0).text()
                    console.log("id: " + id + "no: " + i)
                }).get()

                // movieId = $(".start-times div.span3 a").map(function (i, el) {
                //     // { center: '2',
                //     // date: '2017-09-13',
                //     // movie: '145027',
                //     // prgid: '74563' }
                //     return getJsonFromUrl($(this).attr("href")).movie

                // }).get()

                times = $("div.detailview-element div.overview-element>div.row").children('.span6').map(function (i, el) {
                    // get times, as the are in [ [] ] form return array element 0 and filter only Strings
                    // => Filter out undefined rows
                    time = [$(this).find(".start-times p.time-desc").map(function (i, el) {
                        return $(this).text().replace(/\s/g, '')
                    }).get()].filter(String)[0]

                    ids = [$(this).find(".start-times p.time-desc span").map(function (i, el) {
                        return $(this).data("status")
                    }).get()].filter(String)[0]

                    // https://lodash.com/docs/4.17.4#zip
                    return time != undefined ? _.zipObject(time, ids) : null
                }).get()


                movie = _.zipObject(namesOV, movieId)

                // console.dir(namesOV.length)

                // { 'Atomic Blonde': { '20:45': '2_74534' },
                // 'Baby Driver': { '16:15': '2_74535' },
                // 'American Made': { '15:45': '2_74519', '18:00': '2_74525', '20:15': '2_74531' },
                // Dunkirk: { '17:45': '2_74524' },
                // 'The Emoji Movie': { '16:00': '2_74517' },
                // 'Despicable Me 3': { '16:30': '2_74520' },
                // 'An Inconvenient Sequel: Truth to Power': { '18:30': '2_74526', '20:30': '2_74532' },
                // 'The Hitman’s Bodyguard': { '20:00': '2_74530' },
                // 'My Cousin Rachel': { '18:15': '2_74521', '20:30': '2_74527' },
                // 'The Circle': { '15:30': '2_74516', '17:45': '2_74523', '20:00': '2_74529' },
                // 'The Limehouse Golem': { '18:30': '2_74528' },
                // 'Tulip Fever': { '16:00': '2_74522' } }
                films = _.zipObject(movie, times)

                if (Object.getOwnPropertyNames(films).length > 0) {
                    console.log(date + ": " + centerId[center])
                    console.dir(films)
                }

            }) // request
    }) // forEach center
}) // forEach date