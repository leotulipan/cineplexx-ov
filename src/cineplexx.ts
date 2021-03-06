var request = require('request');
// https://github.com/cheeriojs/cheerio
import * as cheerio from 'cheerio'
import * as fs from 'fs'
// import * as Rx from 'rxjs-es/Rx'
import * as Rx from '@reactivex/rxjs'
// import {
//     RxHR
// }
// from "@akanass/rx-http-request"

const DEBUG = true;

/**
 * Interface for the program object/json
 *  generated with http://json2ts.com/
 */
// declare module CineplexxNamespace {

export interface CineplexxProgram {
    movieId: number;
    prgId: number;
    center: number;
    date: string;
    ticketMovieInfo_url: string;
    seat_url: string;
    plan: string;
    technology: string;
    technologyId: number;
    time: string;
    status: string;
    name: string;
    genres: string[];
    availableSeats: number;
    numberOfSeats: number;
}

export interface CineplexxMovies {
    name: string;
    genres: string[];
    name_DE: string;
}

// }

const seats_status = {
    NOT_AVAILABLE: 0,
    AVAILABLE: 1,
    SOLD: 0
}


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
    private _movies: Array < CineplexxMovies > ;
    private _programmes: Array < CineplexxProgram > ;

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

    public get movies(): Array < CineplexxMovies > {
        return this._movies;
    }

    public set movies(value: Array < CineplexxMovies > ) {
        this._movies = value;
    }

    public get programmes(): Array < CineplexxProgram > {
        return this._programmes;
    }

    public set programmes(value: Array < CineplexxProgram > ) {
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

    // Check for empty return:
    // <div class="detailview-element">
    // Für die aktuelle Auswahl sind keine Filme vorhanden.</div>
    // null if not found, otherwise we get some return value
    if ($("div.detailview-element").eq(0).text().match("keine Filme vorhanden")) {
        if (DEBUG) console.log("No Movies found in programm.php")
        cineplexx.dates = []
        return false
    }

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

                    observer.next()
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


/**
 * getProgrammes gets the info for each program from the URL string
 * 2017-10-03 Url changed to new format
 * 
 * @param {any} body HTML Body to parse
 */
function getProgrammes(body) {
    $ = cheerio.load(body)

    cineplexx.programmes = [$(".overview-element .start-times a").map(function (i, el) {

        let prgUrl = $(this).attr("href").split("/")
        //  https://www.cineplexx.at/tickets/#/center/2/movie/137032/date/2017-10-03/program/66/select
        let movieId = prgUrl[prgUrl.indexOf("movie") + 1]
        let prgId = prgUrl[prgUrl.indexOf("program") + 1]
        let center = prgUrl[prgUrl.indexOf("center") + 1]
        let date = prgUrl[prgUrl.indexOf("date") + 1]
        let ticketMovieInfo_url = "https://www.cineplexx.at/rest/cinema/ticketMovieInfo?callback=t&center=" + center + "&movie=" + movieId + "&date=" + date + "&prgId=" + prgId
        let seat_url = "https://www.cineplexx.at/restV/cinemas/" + center + "/program/" + prgId + "/seat-selection-view/"

        return {
            movieId: movieId,
            prgId: prgId,
            center: center,
            date: date,
            // time: $(this).find("p").eq(0).text().substr(1, 5),
            // plan: $(this).find("p.room-desc").text(),
            ticketMovieInfo_url: ticketMovieInfo_url,
            seat_url: seat_url,
        }
    }).get()].filter(String)[0]
    if (DEBUG) console.log("   getProgrammes #:" + cineplexx.programmes.length)
}



function parseProgramDetails(error, response, body, i) {
    if (error) {
        return error
    } else {
        if (DEBUG) console.log('   parseProgramDetails #' + i)
        let ticketMovieInfo = JSON.parse(body.substr(2, body.length - 3))
        let program = []

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

        cineplexx.programmes[i]["plan"] = ticketMovieInfo.plan
        cineplexx.programmes[i]["technology"] = ticketMovieInfo.technology
        cineplexx.programmes[i]["technologyId"] = ticketMovieInfo.technologyId
        cineplexx.programmes[i]["time"] = ticketMovieInfo.time
        cineplexx.programmes[i]["status"] = ticketMovieInfo.status
        cineplexx.programmes[i]["name"] = cineplexx.movies[cineplexx.programmes[i]["movieId"]].name
        cineplexx.programmes[i]["genres"] = cineplexx.movies[cineplexx.programmes[i]["movieId"]].genres

    }
    // if (DEBUG) console.log(' obs getProgramDetails complete')
    return true
}

/**
 * 
 * 
 * @returns {Rx.Observable < any >} 
 */
function getProgramDetails(): Rx.Observable < any > {
    if (DEBUG) console.log('  getProgramDetails')

    let obsProgram = []

    cineplexx.programmes.forEach((program, i) => {
        if (DEBUG) console.log('  getProgramDetails p#' + i)

        // Request as Observable syntax copied from https://github.com/Alex0007/request-observable/blob/master/index.ts
        // We are creating an array of observables and each does
        // - parse one ticketMovieInfo_url
        // - call parseProgramDetails with the resulting html
        // - Add the data to our cineplexx.programmes var
        obsProgram.push(Rx.Observable.create((observer) => {
            if (DEBUG) console.log("Creating getProgramDetails obs #" + i)
            request(program.ticketMovieInfo_url, (error, response, body) => {
                if (error) {
                    observer.error(error)
                } else {
                    if (DEBUG) console.log("getProgramDetails obs req #" + i)
                    observer.next(parseProgramDetails(error, response, body, i))
                }
                observer.complete()
            })
        }))
    })

    // Join all observables into one master observable which we return and can subscribe to
    return Rx.Observable.forkJoin(obsProgram)
}

/**
 * 
 * The JSON Object (important keys only)
 * { seatPlan: {...},
 *   movieTitle: 'Blade Runner 2049 OV',
 *   programShowTime: '15:30',
 *   programShowDate: '11. October 2017',
 *   cinemaName: '1002',
 *   cinemaScreenName: 'Saal 4',
 *   seatPlanBackgroundImageName: '1002_4',
 *   childTicketsAllowed: false }
 * 
 *  seatPlan.areas = [ { id: 0,
      rows:
        [ { id: '1', bounds: [Object], seats: [Array], accurateLeft: 0 },
          { id: 'hallway', bounds: [Object], seats: [], accurateLeft: 0 },
          { id: '10', bounds: [Object], seats: [Array], accurateLeft: 0 },
          { id: 'hallway', bounds: [Object], seats: [], accurateLeft: 0 },
          { id: 'B1', bounds: [Object], seats: [Array], accurateLeft: 0 },
          numberOfRows: 19,
        ]
 * @returns {Rx.Observable < any >} 
 */
function getSeats(program_i: number): Rx.Observable < any > {

    return Rx.Observable.create((observer) => {
        if (DEBUG) console.log("Creating getSeats obs #" + program_i)
        request(cineplexx.programmes[program_i].seat_url, (error, response, body) => {
            if (error) {
                observer.error(error)
            } else {
                if (DEBUG) console.log("getSeats obs '" + cineplexx.programmes[program_i].seat_url + "'")
                let seats = JSON.parse(body)
                let numberOfSeats: number = 0
                let availableSeats: number = 0

                seats.seatPlan.areas[0].rows.forEach(row => {
                    row.seats.forEach(seat => {
                        numberOfSeats++
                        availableSeats += seats_status[seat.status]
                    })
                })
                if (DEBUG) console.log("Seats: " + availableSeats + " of " + numberOfSeats)
                cineplexx.programmes[program_i].availableSeats = availableSeats
                cineplexx.programmes[program_i].numberOfSeats = numberOfSeats
                observer.next()
            }
            observer.complete()
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
                getMovieDetails(center, date).subscribe(() => {
                    if (DEBUG) console.log(" obs getMovieDetails subscribe")
                    getProgramDetails().subscribe(() => {
                        if (DEBUG) console.log(" obs getProgramDetails sub")
                        getSeats(2).subscribe(() => {
                            if (DEBUG) console.log(JSON.stringify(cineplexx.movies[1]))
                        })
                    })
                })
            });
        });
    })


}

main();