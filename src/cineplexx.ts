var request = require('request');
// https://github.com/cheeriojs/cheerio
import * as cheerio from 'cheerio'
import * as fs from 'fs'
// import * as Rx from 'rxjs-es/Rx'
import * as Rx from '@reactivex/rxjs'
import {
    RxHR
}
from "@akanass/rx-http-request"

const DEBUG = true;

// I love ruby http://www.railstips.org/blog/archives/2008/12/01/unless-the-abused-ruby-conditional/
var unless = condition => !condition

/**
 * return a JSON object from a given URL
 * 
 * Based on https://stackoverflow.com/a/8486188/1440255
 * 
 * @param {any} [url=location.href] 
 * @param {boolean} [hashBased=true] 
 * @returns JSON object with all params as hashes
 */
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
        var val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) :
            "";
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


/**
 * The main Cineplexx class with all variables
 * 
 * @class Cineplexx
 */
class Cineplexx {

    private _today: string;
    private _dates: Array < string > ;
    private _centerIds: {};
    private _OVcenter: Array < number > ;
    private _movies: Array < {} > ;
    private _programmes: Array < {} > ;

    constructor() {

        this.today = new Date().toJSON().slice(0, 10)
        this.dates = [this.today]

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
        }

        if (DEBUG) {
            this._OVcenter = [2]
        } else {
            this._OVcenter = [6, 8, 2, 75, 115]
        }

        this.movies = []

    }

    public get OVcenter(): Array < number > {
        return this._OVcenter;
    }

    public get today(): string {
        return this._today;
    }

    public set today(value: string) {
        this._today = value;
    }

    public get dates(): Array < string > {
        return this._dates;
    }

    public set dates(value: Array < string > ) {
        this._dates = value;
    }

    public getCenterName(center) {
        return this._centerIds[center]
    }

    public get movies(): Array < {} > {
        return this._movies;
    }

    public set movies(value: Array < {} > ) {
        this._movies = value;
    }

    public get programmes(): Array < {} > {
        return this._programmes;
    }

    public set programmes(value: Array < {} > ) {
        this._programmes = value;
    }

} // class Cineplexx

let cineplexx = new Cineplexx();
let $: any;

function getDates(): Rx.Observable < any > {
    if (DEBUG) console.log(" obs getDates create")
    return Rx.Observable.create((observer) => {
        request('http://www.cineplexx.at/service/program.php?type=program&centerId=2&date=' +
            cineplexx.today +
            '&originalVersionTypeFilter=OV&sorting=alpha&undefined=Alle&view=detail',
            (error, response, body) => {
                if (error) {
                    observer.error();
                } else {
                    if (DEBUG) console.log(' obs getDates next')
                    observer.next(parseDates(body))
                }
                if (DEBUG) console.log(' obs getDates complete')
                observer.complete();
            })
    })
}

/**
 * parseDates parses the available dates from a given html document
 *            The available dates come from the #date dropdown
 * when DEBUG = true then dates will ONLY include today
 * @param {any} body 
 */
function parseDates(body) {
    if (DEBUG) console.log('  parseDates start')
    // console.log('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    $ = cheerio.load(body)

    let allDates: Array < string > = [];

    $("[name=date] > option").each(function (i, element) {
        // console.dir($(this).val())
        if ($(this).val())
            allDates.push($(this).val())
    })
    // debug: only check today
    if (DEBUG) cineplexx.dates = [cineplexx.today]
    else cineplexx.dates = allDates
    if (DEBUG) console.log("  parseDates: " + allDates)
    return cineplexx.dates
}

function getMovieDetails(center, date): Rx.Observable < any > {
    if (DEBUG) console.log(" obs getMovieDetails create")
    return Rx.Observable.create((observer) => {
        request('http://www.cineplexx.at/service/program.php?type=program&centerId=' +
            center + '&date=' + date +
            '&originalVersionTypeFilter=OV&sorting=alpha&undefined=Alle&view=detail',
            (error, response, body) => {
                if (error) {
                    observer.error();
                } else {
                    if (DEBUG) console.log(' obs getMovieDetails next')
                    parseMovies(body)
                    getProgrammes(body)

                    // needs to sub to all the observers that get created?
                    getProgramDetails()
                    // observer.next()
                }
                if (DEBUG) console.log(' obs getMovieDetails complete')
                observer.complete();
            })
    })
}

function parseMovies(body) {
    $ = cheerio.load(body)
    if (DEBUG) console.log("  parseMovies #:" + $("div.overview-element").length)
    var movies = cineplexx.movies
    $("div.overview-element").map(function (i, el) {
        let name = $(this).find(".three-lines p").eq(0).text()
        let name_DE = $(this).find("h2").eq(0).text()
        let movieId = $(this).data("mainid")
        let genreIds = String($(this).data("genre")).split(" ")
        return movies[movieId] = {
            name: name,
            genres: genreIds,
            name_DE: name_DE,
        }
    })
    cineplexx.movies = movies
    if (DEBUG) console.log("  parseMovies done")
    return cineplexx.movies
}

function getProgrammes(body) {
    $ = cheerio.load(body)

    cineplexx.programmes = [$(".overview-element .start-times a").map(function (i, el) {

        let movieId = getJsonFromUrl($(this).attr("href")).movie
        let prgId = getJsonFromUrl($(this).attr("href")).prgid
        let center = getJsonFromUrl($(this).attr("href")).center
        let date = getJsonFromUrl($(this).attr("href")).date
        let ticketMovieInfo_url = "https://www.cineplexx.at/rest/cinema/ticketMovieInfo?callback=t&center=" + center + "&movie=" + movieId + "&date=" + date + "&prgId=" + prgId

        return {
            movieId: movieId,
            prgId: prgId,
            center: center,
            date: date,
            // time: $(this).find("p").eq(0).text().substr(1, 5),
            // plan: $(this).find("p.room-desc").text(),
            ticketMovieInfo_url: ticketMovieInfo_url,
        }
    }).get()].filter(String)[0]
    // if (DEBUG) console.log("Programmes: ")
    // if (DEBUG) console.dir(cineplexx.programmes)
}

// still needs to be refactored
function getProgramDetails() {
    if (DEBUG) console.log('  getProgramDetails #s:' + cineplexx.programmes.length)
    // var programmes
    cineplexx.programmes.forEach(function (program, i) {
        Rx.Observable.create((observer) => {
            request(program.ticketMovieInfo_url, (error, response, body) => {
                if (error) {
                    observer.error();
                } else {
                    if (DEBUG) console.log(' obs getProgramDetails next')
                    let ticketMovieInfo = JSON.parse(body.substr(2, body.length - 3))

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

                    // var movies

                    cineplexx.programmes[i]["plan"] = ticketMovieInfo.plan
                    cineplexx.programmes[i]["technology"] = ticketMovieInfo.technology
                    cineplexx.programmes[i]["technologyId"] = ticketMovieInfo.technologyId
                    cineplexx.programmes[i]["time"] = ticketMovieInfo.time
                    cineplexx.programmes[i]["status"] = ticketMovieInfo.status
                    cineplexx.programmes[i]["name"] = cineplexx.movies[programmes[i]["movieId"]].name
                    cineplexx.programmes[i]["genres"] = cineplexx.movies[programmes[i]["movieId"]].genres

                    console.dir(cineplexx.programmes[i])
                }
                if (DEBUG) console.log(' obs getProgramDetails complete')
                observer.complete();
            })
        })
    })
}

/**
 * The main function where our code gets executed
 * 
 */
function main() {

    getDates().subscribe(() => {
        if (DEBUG) console.log('main() getDates() subscribe loop')
        cineplexx.dates.forEach((date) => {
            if (DEBUG) console.log(" main() checking " + date)
            cineplexx.OVcenter.forEach((center) => {
                if (DEBUG) console.log("  main() \'" + cineplexx.getCenterName(center) + "\'")
                getMovieDetails(center, date).subscribe(() => {})
            });
        });
    })
}

main();