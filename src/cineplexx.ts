// var request = require('request');
// https://github.com/cheeriojs/cheerio
import * as cheerio from 'cheerio'
import * as fs from 'fs'
// import * as Rx from 'rxjs-es/Rx'
// import * as Rx from '@reactivex/rxjs'
import {
    RxHR
}
from "@akanass/rx-http-request"

const DEBUG = true;

// I love ruby http://www.railstips.org/blog/archives/2008/12/01/unless-the-abused-ruby-conditional/
var unless = condition => !condition

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


class Cineplexx {


    private _today: string;
    private _dates: Array < string > ;
    private _centerIds: {};
    private _OVcenter: Array < number > ;
    private _movies: {};
    private _programmes: Array < {} > ;

    constructor() {

        this.today = new Date().toJSON().slice(0, 10)
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
        }

        // this._OVcenter = [6, 8, 2, 75, 115]
        this._OVcenter = [2]

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

    public get movies(): {} {
        return this._movies;
    }

    public set movies(value: {}) {
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
getData();

function getData() {
    // const readdir = Rx.Observable.bindNodeCallback(fs.readdir);
    // const source = readdir('./');

    // RXJS OBSERVABLE TEST CODE
    //
    //
    RxHR.get('http://www.cineplexx.at/service/program.php?type=program&centerId=2&date=' +
        cineplexx.today +
        '&originalVersionTypeFilter=OV&sorting=alpha&undefined=Alle&view=detail'
    ).subscribe(data => parseAllDates(data),
        err => console.error("Error: " + err),
        () => console.log('First request complete'));

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
    const $ = cheerio.load(body)
    let allDates: Array < string > = [];

    $("[name=date] > option").each(function (i, element) {
        // console.dir($(this).val())
        if ($(this).val())
            allDates.push($(this).val())
    })

    // cineplexx.dates = allDates
    // debug: only check today
    cineplexx.dates = [cineplexx.today]

    cineplexx.dates.forEach((date) => {
        cineplexx.OVcenter.forEach((center) => {

            if (DEBUG) console.log("Checking \'" + cineplexx.getCenterName(center) + "\' on " + date)
            // getMovies(center, date)

            // next function in the chain
            // chain();
        });
    });
}

function getMovies(center, date) {

    request('http://www.cineplexx.at/service/program.php?type=program&centerId=' +
        center + '&date=' + date +
        '&originalVersionTypeFilter=OV&sorting=alpha&undefined=Alle&view=detail',
        function (error, response, body) {
            if (error)
                console.log('Request error: ', error)
            // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            const $ = cheerio.load(body)

            let movies = {}
            $("div.overview-element").map(function (i, el) {
                let name = $(this).find(".three-lines p").eq(0).text()
                let movieId = $(this).data("mainid")
                let genreIds = String($(this).data("genre")).split(" ")

                return movies[movieId] = {
                    name: name,
                    genres: genreIds,
                }
            })
            cineplexx.movies = movies
            console.dir(cineplexx.movies)
            getProgrammes($)
        })
}

function getProgrammes(htmlBody) {

    cineplexx.programmes = [htmlBody(".overview-element .start-times a").map(function (i, el) {

        let movieId = getJsonFromUrl(htmlBody(this).attr("href")).movie
        let prgId = getJsonFromUrl(htmlBody(this).attr("href")).prgid
        let center = getJsonFromUrl(htmlBody(this).attr("href")).center
        let date = getJsonFromUrl(htmlBody(this).attr("href")).date
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
    console.dir(cineplexx.programmes)
    console.log("end getProgrammes")
}

// still needs to be refactored
function getProgramDetails() {
    var programmes
    programmes.forEach(function (program, i) {

        request(program.ticketMovieInfo_url, function (error, response, body) {
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

            var movies

            programmes[i]["plan"] = ticketMovieInfo.plan
            programmes[i]["technology"] = ticketMovieInfo.technology
            programmes[i]["technologyId"] = ticketMovieInfo.technologyId
            programmes[i]["time"] = ticketMovieInfo.time
            programmes[i]["status"] = ticketMovieInfo.status
            programmes[i]["name"] = movies[programmes[i]["movieId"]].name
            programmes[i]["genres"] = movies[programmes[i]["movieId"]].genres

            // works here
            console.dir(programmes[i])

        })
    })



}