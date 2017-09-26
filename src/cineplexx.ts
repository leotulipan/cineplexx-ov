import request = require('request')
// https://github.com/cheeriojs/cheerio
import cheerio = require('cheerio')
import * as fs from "fs"
// import _ = require('lodash')

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


    // public static async getData(): Promise<Cineplexx> {
    //     await Promise.all(this.setDates())
    //     return this

    // }
    public centerName(center) {
        return this._centerIds[center]
    }

} // class Cineplexx


let cineplexx = new Cineplexx();
getData();

function getData() {

    // Get all available dates from dropdown named "date" (option value)
    request('http://www.cineplexx.at/service/program.php?type=program&centerId=2&date=' +
        cineplexx.today +
        '&originalVersionTypeFilter=OV&sorting=alpha&undefined=Alle&view=detail',
        (error, response, body) => {
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
                    console.log("Checking \'" + cineplexx.centerName(center) + "\' on " + date)

                    // next function in the chain
                    // chain();
                });

            });

        })
}

function chain() {


    request('http://www.cineplexx.at/service/program.php?type=program&centerId=' +
        center + '&date=' + date +
        '&originalVersionTypeFilter=OV&sorting=alpha&undefined=Alle&view=detail',
        function (error, response, body) {
            if (error)
                console.log('Request error: ', error)
            // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            const $ = cheerio.load(body)

            movies = {}
            programmes = Array()

            $("div.overview-element").map(function (i, el) {
                let name = $(this).find(".three-lines p").eq(0).text()
                let movieId = $(this).data("mainid")
                let genreIds = String($(this).data("genre")).split(" ")

                return movies[movieId] = {
                    name: name,
                    genres: genreIds,
                }

            })

            programmes = [$(".overview-element .start-times a").map(function (i, el) {

                let movieId = getJsonFromUrl($(this).attr("href")).movie
                let prgId = getJsonFromUrl($(this).attr("href")).prgid
                center = getJsonFromUrl($(this).attr("href")).center
                date = getJsonFromUrl($(this).attr("href")).date
                var ticketMovieInfo = {}

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

            // not here, because async
            // console.dir(programmes)

        }) // request


}