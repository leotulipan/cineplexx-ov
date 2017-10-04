# Get Cineplexx Austria OV (Original Version) Movie and time info
## Goal

```
{ 
  id: 143539  
  name: 'Going in style',
  name.DE: 'Deutscher Titel',
  imdb: '1782901782'
  imdbRating: '5.5' 
  meta: '55' 
  genres: ['8', '14', '31'],
  watchlist: true
}


{
id: 143539,
showtimes: {
    '2017-99-99': {
        '16:30': [{
                prgid: '74583',
                center: 2,
                techId: 1,
                seatsAvailable: 20,
                screen: "Saal 5"
            },
            {
                prgid: '74581',
                center: 104,
                techId: 1
            }
        ]
        '20:00': [{
            prgid: '74589',
            center: 2,
            techId: 5,
            seatsAvailable: 178,
            screen: "Saal 1"
        }]
    }
    '2017-99-88': {
        '18:15': [{
                prgid: '66666',
                center: 100,
                techId: 1,
                seatsAvailable: 140,
                screen: "Saal 2"
            },
        }
    }
```

# Next Step
- Line 335: "join"/concat/flatMap/SwitchMap - but how?
    maybe http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-map

- interface for program and movies

- observables Info:
    chain observers with map/flatMap https://stackoverflow.com/questions/37748241/how-to-do-the-chain-sequence-in-rxjs/37748799#37748799
    https://www.youtube.com/watch?v=Tux1nhBPl_w
    https://www.udemy.com/the-complete-guide-to-angular-2/learn/v4/t/lecture/6656534?start=0
    http://reactivex.io/rxjs/manual/overview.html
    https://www.academind.com/articles/javascript/callbacks-promises-observables-async-await

- get avail seats for prgid from seats array:

https://www.cineplexx.at/service/ticketing.php?callback=jQuery19102461141216697098_1505981639843&center=2&prgId=74723&backendUrl=rest%2Fcinema%2Fseats&_=1505981639845
=> centerID + prgId
https://www.cineplexx.at/service/ticketing.php?callback=s&center=2&prgId=74726&backendUrl=rest%2Fcinema%2Fseats

```
{
        "seats": [
            [{
                "row": "1",
                "rowName": "1",
                "seat": "1",
                "category": "1",
                "color": "#99ccff",
                "price": 9.6,
                "x": 5570,
                "y": 3556,
                "status": 0,
                "width": 304,
                "seatName": ""
            }, {
                "row": "1",
                "rowName": "1",
                "seat": "2",
                "category": "1",
                "color": "#99ccff",
                "price": 9.6,
                "x": 5266,
                "y": 3556,
                "status": 0,
                "width": 304,
                "seatName": ""
            }, {

            ...

                "row": "1",
                "rowName": "1",
                "seat": "7",
                "category": "1",
                "color": "#99ccff",
                "price": 9.6,
                "x": 3746,
                "y": 3556,
                "status": 0,
                "width": 305,
                "seatName": ""
            }],
            [{
                "row": "2",
                "rowName": "2",
                "seat": "1",
                "category": "1",
                "color": "#99ccff",
                "price": 9.6,
                "x": 5570,
                "y": 4148,
                "status": 0,
                "width": 304,
                "seatName": ""
            }, 
            ........
        ],
        "reductions": [{
            "reductionId": "0",
            "reductionName": "Normalpreis",
            "price": "\u20ac 0,00"
        }, {
            "reductionId": "9",
            "reductionName": "Kinder",
            "price": "\u20ac 0,00"
        }],
        "selectedSeats": {
            "rows": "",
            "seats": "",
            "seatCount": 0,
            "price": "\u20ac 0,00",
            "reservationId": 0,
            "reservationLimit": 0,
            "reductions": [null],
            "startTime": 1506018600000,
            "prgId": 74726,
            "center": "Artis International",
            "movieName": "The Circle OV",
            "filmId": 142426,
            "plan": "Saal 6",
            "vipId": "0",
            "resVipId": "0",
            "pickupTime": 0,
            "resType": 0,
            "startString": "21.09.2017 20:30",
            "success": true,
            "reductionIds": ""
        },
        "movieCards": [],
        "isStarCard": false,
        "count": 0,
        "children": 0,
        "hasPreviousTickets": false
    }
```

- without JS, this might not yield correct info  url https://www.cineplexx.at/ticketing/?center=2&date=2017-09-12&movie=143827&prgid=74553
    - film data: span6[1] > span3


- get technology + genre names http://www.cineplexx.at/filme/jetzt-im-kino/
  - span3 data-tech + data-genre
  - span3 > p für die Namen     
     https://www.cineplexx.at/rest/cinema/ticketMovieInfo?callback=info&center=2&movie=143827&date=2017-09-12&prgId=74553
      info({"date":"Heute, 12. September 2017","shortDate":"Heute, 12. Sep 2017","time":"20:45","technology":"Digital 2D","technologyId":1,"plan":"Saal 5","movieName":"Atomic Blonde","centerName":"Artis International","status":"green","category":"0","originalVersionType":"OV","prgCount":1,"events":[]})
  - build technology array - data-technology="1" (ticketing URL)
        #ticketing-content > div.row > div.span5 > div > p
  - build gentre array - data-genre="3 14"
        (http://www.cineplexx.at/film/atomic-blonde/
         .filmdetails > table > tbody > tr:nth-child(5) > td:nth-child(2)
           <td>Genre:</td>
						<td>Action, Thriller</td>
- get data from multiple centers into "showtimes:"
- show available showtimes for each day in a table sorted by film (not centerID)
- filter out Kino-Saal we dont like - room -desc
- refactor to typescript
    https://code.visualstudio.com/docs/languages/typescript
    https://stackoverflow.com/questions/29996145/visual-studio-code-compile-on-save
- seats: array: check how many seats are available: https://www.cineplexx.at/service/ticketing.php?callback=jQuery19107128564620655915_1505196280356&center=2&prgId=74553&backendUrl=rest%2Fcinema%2Fseats&_=1505196280358
seats[row][seat].status == 0 ? "available" : "reserved"
- program/film status green array http://www.cineplexx.at/service/dynamicFilterData.php?callback=status&movie=143827
- [this might solve the Promise errors from rxjs](https://github.com/ReactiveX/rxjs/issues/2422)

- Periodic Check: Unser reguläres Kinoprogramm wird wöchentlich neu erstellt und immer am Dienstagabend für die folgende Kinowoche (Freitag bis Donnerstag) online gestellt. 
            
# Starting dev (first time)

npm init => create empty package.json
npm install --save-dev request
npm install --save-dev cheerio

# Running the code

See also https://stackoverflow.com/questions/33535879/how-to-run-typescript-files-from-command-line for ts-node option

## Compile (and watch) Typescript:

    CTRL-SHIFT-B in Visual Studio Code (Build Task)
    tsc -w cineplexx.ts

## Run:

    # save current html file
    wget -O test/cineplexx-programm.html "http://www.cineplexx.at/service/program.php?type=program&centerId=2&date=`date "+%Y-%m-%d"`&originalVersionTypeFilter=OV&sorting=alpha&undefined=Alle&view=detail"
    # run code
    node js/cineplexx

