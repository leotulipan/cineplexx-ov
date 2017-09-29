"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// var request = require('request');
// https://github.com/cheeriojs/cheerio
var cheerio = require("cheerio");
// import * as Rx from 'rxjs-es/Rx'
// import * as Rx from '@reactivex/rxjs'
var rx_http_request_1 = require("@akanass/rx-http-request");
var DEBUG = true;
// I love ruby http://www.railstips.org/blog/archives/2008/12/01/unless-the-abused-ruby-conditional/
var unless = function (condition) { return !condition; };
// Based on https://stackoverflow.com/a/8486188/1440255
function getJsonFromUrl(url, hashBased) {
    if (url === void 0) { url = location.href; }
    if (hashBased === void 0) { hashBased = true; }
    var query;
    if (hashBased) {
        var pos = url.indexOf("?");
        if (pos == -1)
            return [];
        query = url.substr(pos + 1);
    }
    else {
        query = url.substr(1);
    }
    var result = {};
    query.split("&").forEach(function (part) {
        if (!part)
            return;
        part = part.split("+").join(" "); // replace every + with space, regexp-free version
        var eq = part.indexOf("=");
        var key = eq > -1 ? part.substr(0, eq) : part;
        var val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) :
            "";
        var from = key.indexOf("[");
        if (from == -1)
            result[decodeURIComponent(key)] = val;
        else {
            var to = key.indexOf("]", from);
            var index = decodeURIComponent(key.substring(from + 1, to));
            key = decodeURIComponent(key.substring(0, from));
            if (!result[key])
                result[key] = [];
            if (!index)
                result[key].push(val);
            else
                result[key][index] = val;
        }
    });
    return result;
}
var Cineplexx = (function () {
    function Cineplexx() {
        this.today = new Date().toJSON().slice(0, 10);
        // this.setDates();
        this._centerIds = {
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
        };
        // this._OVcenter = [6, 8, 2, 75, 115]
        this._OVcenter = [2];
    }
    Object.defineProperty(Cineplexx.prototype, "OVcenter", {
        get: function () {
            return this._OVcenter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cineplexx.prototype, "today", {
        get: function () {
            return this._today;
        },
        set: function (value) {
            this._today = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cineplexx.prototype, "dates", {
        get: function () {
            return this._dates;
        },
        set: function (value) {
            this._dates = value;
        },
        enumerable: true,
        configurable: true
    });
    Cineplexx.prototype.getCenterName = function (center) {
        return this._centerIds[center];
    };
    Object.defineProperty(Cineplexx.prototype, "movies", {
        get: function () {
            return this._movies;
        },
        set: function (value) {
            this._movies = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cineplexx.prototype, "programmes", {
        get: function () {
            return this._programmes;
        },
        set: function (value) {
            this._programmes = value;
        },
        enumerable: true,
        configurable: true
    });
    return Cineplexx;
}()); // class Cineplexx
var cineplexx = new Cineplexx();
getData();
function getData() {
    // const readdir = Rx.Observable.bindNodeCallback(fs.readdir);
    // const source = readdir('./');
    // RXJS OBSERVABLE TEST CODE
    //
    //
    rx_http_request_1.RxHR.get('http://www.cineplexx.at/service/program.php?type=program&centerId=2&date=' +
        cineplexx.today +
        '&originalVersionTypeFilter=OV&sorting=alpha&undefined=Alle&view=detail').subscribe(function (data) { return parseAllDates(data); }, function (err) { return console.error("Error: " + err); }, function () { return console.log('First request complete'); });
    // Get all available dates from dropdown named "date" (option value)
    // request.get('http://www.cineplexx.at/service/program.php?type=program&centerId=2&date=' +
    //     cineplexx.today +
    //     '&originalVersionTypeFilter=OV&sorting=alpha&undefined=Alle&view=detail',
    //     (error, response, body) => {
    //         // Get all available dates from the #date dropdown
    //         // console.log('error:', error); // Print the error if one occurred
    //         // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //         const $ = cheerio.load(body)
    //         let allDates: Array < string > = [];
    //         $("[name=date] > option").each(function (i, element) {
    //             // console.dir($(this).val())
    //             if ($(this).val())
    //                 allDates.push($(this).val())
    //         })
    //         // cineplexx.dates = allDates
    //         // debug: only check today
    //         cineplexx.dates = [cineplexx.today]
    //         cineplexx.dates.forEach((date) => {
    //             cineplexx.OVcenter.forEach((center) => {
    //                 console.log("Checking \'" + cineplexx.getCenterName(center) + "\' on " + date)
    //                 // getMovies(center, date)
    //                 // next function in the chain
    //                 // chain();
    //             });
    //         });
    //     })
}
function parseAllDates(body) {
    // Get all available dates from the #date dropdown
    // console.log('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    var $ = cheerio.load(body);
    var allDates = [];
    $("[name=date] > option").each(function (i, element) {
        // console.dir($(this).val())
        if ($(this).val())
            allDates.push($(this).val());
    });
    // cineplexx.dates = allDates
    // debug: only check today
    cineplexx.dates = [cineplexx.today];
    cineplexx.dates.forEach(function (date) {
        cineplexx.OVcenter.forEach(function (center) {
            if (DEBUG)
                console.log("Checking \'" + cineplexx.getCenterName(center) + "\' on " + date);
            // getMovies(center, date)
            // next function in the chain
            // chain();
        });
    });
}
function getMovies(center, date) {
    request('http://www.cineplexx.at/service/program.php?type=program&centerId=' +
        center + '&date=' + date +
        '&originalVersionTypeFilter=OV&sorting=alpha&undefined=Alle&view=detail', function (error, response, body) {
        if (error)
            console.log('Request error: ', error);
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        var $ = cheerio.load(body);
        var movies = {};
        $("div.overview-element").map(function (i, el) {
            var name = $(this).find(".three-lines p").eq(0).text();
            var movieId = $(this).data("mainid");
            var genreIds = String($(this).data("genre")).split(" ");
            return movies[movieId] = {
                name: name,
                genres: genreIds,
            };
        });
        cineplexx.movies = movies;
        console.dir(cineplexx.movies);
        getProgrammes($);
    });
}
function getProgrammes(htmlBody) {
    cineplexx.programmes = [htmlBody(".overview-element .start-times a").map(function (i, el) {
            var movieId = getJsonFromUrl(htmlBody(this).attr("href")).movie;
            var prgId = getJsonFromUrl(htmlBody(this).attr("href")).prgid;
            var center = getJsonFromUrl(htmlBody(this).attr("href")).center;
            var date = getJsonFromUrl(htmlBody(this).attr("href")).date;
            var ticketMovieInfo_url = "https://www.cineplexx.at/rest/cinema/ticketMovieInfo?callback=t&center=" + center + "&movie=" + movieId + "&date=" + date + "&prgId=" + prgId;
            return {
                movieId: movieId,
                prgId: prgId,
                center: center,
                date: date,
                // time: $(this).find("p").eq(0).text().substr(1, 5),
                // plan: $(this).find("p.room-desc").text(),
                ticketMovieInfo_url: ticketMovieInfo_url,
            };
        }).get()].filter(String)[0];
    console.dir(cineplexx.programmes);
    console.log("end getProgrammes");
}
// still needs to be refactored
function getProgramDetails() {
    var programmes;
    programmes.forEach(function (program, i) {
        request(program.ticketMovieInfo_url, function (error, response, body) {
            var ticketMovieInfo = JSON.parse(body.substr(2, body.length - 3));
            // { date: 'Heute, 22. September 2017',
            // time: '17:30',
            // technology: 'Digital 2D',
            // technologyId: 1,
            // plan: 'Saal 5',
            // status: 'green',
            // prgCount: 1,
            // next:
            //  { ... },
            // events: [] }
            var movies;
            programmes[i]["plan"] = ticketMovieInfo.plan;
            programmes[i]["technology"] = ticketMovieInfo.technology;
            programmes[i]["technologyId"] = ticketMovieInfo.technologyId;
            programmes[i]["time"] = ticketMovieInfo.time;
            programmes[i]["status"] = ticketMovieInfo.status;
            programmes[i]["name"] = movies[programmes[i]["movieId"]].name;
            programmes[i]["genres"] = movies[programmes[i]["movieId"]].genres;
            // works here
            console.dir(programmes[i]);
        });
    });
}
//# sourceMappingURL=cineplexx.js.map