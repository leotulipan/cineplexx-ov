"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require('request');
// https://github.com/cheeriojs/cheerio
var cheerio = require("cheerio");
// import * as Rx from 'rxjs-es/Rx'
var Rx = require("@reactivex/rxjs");
var rx_http_request_1 = require("@akanass/rx-http-request");
var DEBUG = true;
// I love ruby http://www.railstips.org/blog/archives/2008/12/01/unless-the-abused-ruby-conditional/
var unless = function (condition) { return !condition; };
/**
 * return a JSON object from a given URL
 *
 * Based on https://stackoverflow.com/a/8486188/1440255
 *
 * @param {any} [url=location.href]
 * @param {boolean} [hashBased=true]
 * @returns JSON object with all params as hashes
 */
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
/**
 * The main Cineplexx class with all variables
 *
 * @class Cineplexx
 */
var Cineplexx = (function () {
    function Cineplexx() {
        this.today = new Date().toJSON().slice(0, 10);
        this.dates = [this.today];
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
        if (DEBUG) {
            this._OVcenter = [2];
        }
        else {
            this._OVcenter = [6, 8, 2, 75, 115];
        }
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
var $;
function getDates() {
    if (DEBUG)
        console.log(" obs getDates create");
    return Rx.Observable.create(function (observer) {
        request('http://www.cineplexx.at/service/program.php?type=program&centerId=2&date=' +
            cineplexx.today +
            '&originalVersionTypeFilter=OV&sorting=alpha&undefined=Alle&view=detail', function (error, response, body) {
            if (error) {
                observer.onError();
            }
            else {
                // observer.onNext({
                //     response: response,
                //     body: body
                // });
                if (DEBUG)
                    console.log(' obs getDates next');
                observer.next(parseDates(body));
            }
            if (DEBUG)
                console.log(' obs getDates complete');
            observer.complete();
        });
    });
}
;
/**
 * parseDates parses the available dates from a given html document
 *            The available dates come from the #date dropdown
 * when DEBUG = true then dates will ONLY include today
 * @param {any} body
 */
function parseDates(body) {
    if (DEBUG)
        console.log('  parseDates start');
    // console.log('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    $ = cheerio.load(body);
    var allDates = [];
    $("[name=date] > option").each(function (i, element) {
        // console.dir($(this).val())
        if ($(this).val())
            allDates.push($(this).val());
    });
    // debug: only check today
    if (DEBUG)
        cineplexx.dates = [cineplexx.today];
    else
        cineplexx.dates = allDates;
    if (DEBUG)
        console.log("  parseDates: " + allDates);
    return cineplexx.dates;
}
function getMovies(center, date) {
    rx_http_request_1.RxHR.get('http://www.cineplexx.at/service/program.php?type=program&centerId=' +
        center + '&date=' + date +
        '&originalVersionTypeFilter=OV&sorting=alpha&undefined=Alle&view=detail')
        .subscribe(function (data) { return parseMovies(data); }, function (err) { return console.error("Error: " + err); }, function () {
        if (DEBUG)
            console.log('getMovies() request complete');
    });
}
function parseMovies(body) {
    $ = cheerio.load(body);
    if (DEBUG)
        console.log($("div.overview-element").length);
    var movies;
    $("div.overview-element").map(function (i, el) {
        var name = $(this).find(".three-lines p").eq(0).text();
        if (DEBUG)
            console.log("Name: " + name);
        var movieId = $(this).data("mainid");
        var genreIds = String($(this).data("genre")).split(" ");
        return movies[movieId] = {
            name: name,
            genres: genreIds,
        };
    });
    cineplexx.movies = movies;
    if (DEBUG)
        console.log("Movies: ");
    if (DEBUG)
        console.dir(cineplexx.movies);
    getProgrammes($);
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
    if (DEBUG)
        console.log("Programmes: ");
    if (DEBUG)
        console.dir(cineplexx.programmes);
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
/**
 * The main function where our code gets executed
 *
 */
function main() {
    getDates().subscribe(function () {
        if (DEBUG)
            console.log('main() getDates() subscribe loop');
        // because async, this is actually just filled with "today" thanks to the constructor    
        cineplexx.dates.forEach(function (date) {
            cineplexx.OVcenter.forEach(function (center) {
                if (DEBUG)
                    console.log(" main() checking \'" + cineplexx.getCenterName(center) + "\' on " + date);
                getMovies(center, date);
                // next function in the chain
                // chain();
            });
        });
    });
}
main();
//# sourceMappingURL=cineplexx.js.map