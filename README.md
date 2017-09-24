# Goal

{ name: 'Going in style',
  imdb: '1782901782'
  imdbRating: '5.5' 
  meta: '55' 
  genre: 
  watchlist: true
}



{ name: 'Going in style',
  name.DE: 'Deutscher Titel',
  '2017-05-24': {
       '15:30': '2_72146', 
       or maybe:
                '15:30': { id: '2_72146', screen: '4', tech: '3D', 
       '17:45': '2_72148',
       '20:00': '2_72155' 
  }
  '2017-05-25':
  {
       '15:40': '2_72146', 
       '18:45': '2_72148',
  }

}

# Goal object:
{
name: 'The Limehouse Golem',
id: 143539,
genres: ['8', '14', '31'],
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
# Next Step
-  we have "programmes"
  { movieId: '142369',
    prgId: '74726',
    center: '2',
    date: '2017-09-21',
    time: '20:30',
    screenName: 'Saal 6' }
    
- get tech + screen for prgid

line 151 - request must be sync (async problem)

- get avail seats for prgid from seats array:

https://www.cineplexx.at/service/ticketing.php?callback=jQuery19102461141216697098_1505981639843&center=2&prgId=74723&backendUrl=rest%2Fcinema%2Fseats&_=1505981639845
=> centerID + prgId
https://www.cineplexx.at/service/ticketing.php?callback=s&center=2&prgId=74726&backendUrl=rest%2Fcinema%2Fseats

s({"seats":[[{"row":"1","rowName":"1","seat":"1","category":"1","color":"#99ccff","price":9.6,"x":5570,"y":3556,"status":0,"width":304,"seatName":""},{"row":"1","rowName":"1","seat":"2","category":"1","color":"#99ccff","price":9.6,"x":5266,"y":3556,"status":0,"width":304,"seatName":""},{"row":"1","rowName":"1","seat":"3","category":"1","color":"#99ccff","price":9.6,"x":4962,"y":3556,"status":0,"width":304,"seatName":""},{"row":"1","rowName":"1","seat":"4","category":"1","color":"#99ccff","price":9.6,"x":4658,"y":3556,"status":0,"width":304,"seatName":""},{"row":"1","rowName":"1","seat":"5","category":"1","color":"#99ccff","price":9.6,"x":4354,"y":3556,"status":1024,"width":304,"seatName":""},{"row":"1","rowName":"1","seat":"6","category":"1","color":"#99ccff","price":9.6,"x":4050,"y":3556,"status":0,"width":305,"seatName":""},{"row":"1","rowName":"1","seat":"7","category":"1","color":"#99ccff","price":9.6,"x":3746,"y":3556,"status":0,"width":305,"seatName":""}],[{"row":"2","rowName":"2","seat":"1","category":"1","color":"#99ccff","price":9.6,"x":5570,"y":4148,"status":0,"width":304,"seatName":""},{"row":"2","rowName":"2","seat":"2","category":"1","color":"#99ccff","price":9.6,"x":5266,"y":4148,"status":0,"width":304,"seatName":""},{"row":"2","rowName":"2","seat":"3","category":"1","color":"#99ccff","price":9.6,"x":4962,"y":4148,"status":16,"width":304,"seatName":""},{"row":"2","rowName":"2","seat":"4","category":"1","color":"#99ccff","price":9.6,"x":4658,"y":4148,"status":16,"width":304,"seatName":""},{"row":"2","rowName":"2","seat":"5","category":"1","color":"#99ccff","price":9.6,"x":4354,"y":4148,"status":1024,"width":304,"seatName":""},{"row":"2","rowName":"2","seat":"6","category":"1","color":"#99ccff","price":9.6,"x":4050,"y":4148,"status":0,"width":305,"seatName":""},{"row":"2","rowName":"2","seat":"7","category":"1","color":"#99ccff","price":9.6,"x":3746,"y":4148,"status":0,"width":305,"seatName":""}],[{"row":"3","rowName":"3","seat":"1","category":"1","color":"#99ccff","price":9.6,"x":5570,"y":4740,"status":16,"width":304,"seatName":""},{"row":"3","rowName":"3","seat":"2","category":"1","color":"#99ccff","price":9.6,"x":5266,"y":4740,"status":16,"width":304,"seatName":""},{"row":"3","rowName":"3","seat":"3","category":"1","color":"#99ccff","price":9.6,"x":4962,"y":4740,"status":16,"width":304,"seatName":""},{"row":"3","rowName":"3","seat":"4","category":"1","color":"#99ccff","price":9.6,"x":4658,"y":4740,"status":16,"width":304,"seatName":""},{"row":"3","rowName":"3","seat":"5","category":"1","color":"#99ccff","price":9.6,"x":4354,"y":4740,"status":1040,"width":304,"seatName":""},{"row":"3","rowName":"3","seat":"6","category":"1","color":"#99ccff","price":9.6,"x":4050,"y":4740,"status":16,"width":305,"seatName":""},{"row":"3","rowName":"3","seat":"7","category":"1","color":"#99ccff","price":9.6,"x":3746,"y":4740,"status":0,"width":305,"seatName":""}],[{"row":"4","rowName":"4","seat":"1","category":"1","color":"#99ccff","price":9.6,"x":5570,"y":5331,"status":16,"width":304,"seatName":""},{"row":"4","rowName":"4","seat":"2","category":"1","color":"#99ccff","price":9.6,"x":5266,"y":5331,"status":16,"width":304,"seatName":""},{"row":"4","rowName":"4","seat":"3","category":"1","color":"#99ccff","price":9.6,"x":4962,"y":5331,"status":16,"width":304,"seatName":""},{"row":"4","rowName":"4","seat":"4","category":"1","color":"#99ccff","price":9.6,"x":4658,"y":5331,"status":1040,"width":304,"seatName":""},{"row":"4","rowName":"4","seat":"5","category":"1","color":"#99ccff","price":9.6,"x":4354,"y":5331,"status":16,"width":304,"seatName":""},{"row":"4","rowName":"4","seat":"6","category":"1","color":"#99ccff","price":9.6,"x":4050,"y":5331,"status":16,"width":305,"seatName":""}],[{"row":"5","rowName":"5","seat":"1","category":"1","color":"#99ccff","price":9.6,"x":5570,"y":5923,"status":16,"width":304,"seatName":""},{"row":"5","rowName":"5","seat":"2","category":"1","color":"#99ccff","price":9.6,"x":5266,"y":5923,"status":16,"width":304,"seatName":""},{"row":"5","rowName":"5","seat":"3","category":"1","color":"#99ccff","price":9.6,"x":4962,"y":5923,"status":16,"width":304,"seatName":""},{"row":"5","rowName":"5","seat":"4","category":"1","color":"#99ccff","price":9.6,"x":4658,"y":5923,"status":1040,"width":304,"seatName":""},{"row":"5","rowName":"5","seat":"5","category":"1","color":"#99ccff","price":9.6,"x":4354,"y":5923,"status":16,"width":304,"seatName":""},{"row":"5","rowName":"5","seat":"6","category":"1","color":"#99ccff","price":9.6,"x":4050,"y":5923,"status":16,"width":305,"seatName":""}],[{"row":"6","rowName":"6","seat":"1","category":"1","color":"#99ccff","price":9.6,"x":5570,"y":6515,"status":16,"width":304,"seatName":""},{"row":"6","rowName":"6","seat":"2","category":"1","color":"#99ccff","price":9.6,"x":5266,"y":6515,"status":16,"width":304,"seatName":""},{"row":"6","rowName":"6","seat":"3","category":"1","color":"#99ccff","price":9.6,"x":4962,"y":6515,"status":16,"width":304,"seatName":""},{"row":"6","rowName":"6","seat":"4","category":"1","color":"#99ccff","price":9.6,"x":4658,"y":6515,"status":16,"width":304,"seatName":""},{"row":"6","rowName":"6","seat":"5","category":"1","color":"#99ccff","price":9.6,"x":4354,"y":6515,"status":1040,"width":304,"seatName":""},{"row":"6","rowName":"6","seat":"6","category":"1","color":"#99ccff","price":9.6,"x":4050,"y":6515,"status":16,"width":305,"seatName":""},{"row":"6","rowName":"6","seat":"7","category":"1","color":"#99ccff","price":9.6,"x":3746,"y":6515,"status":16,"width":305,"seatName":""}],[{"row":"7","rowName":"7","seat":"1","category":"1","color":"#99ccff","price":9.6,"x":5570,"y":7107,"status":16,"width":304,"seatName":""},{"row":"7","rowName":"7","seat":"2","category":"1","color":"#99ccff","price":9.6,"x":5266,"y":7107,"status":16,"width":304,"seatName":""},{"row":"7","rowName":"7","seat":"3","category":"1","color":"#99ccff","price":9.6,"x":4962,"y":7107,"status":16,"width":304,"seatName":""},{"row":"7","rowName":"7","seat":"4","category":"1","color":"#99ccff","price":9.6,"x":4658,"y":7107,"status":16,"width":304,"seatName":""},{"row":"7","rowName":"7","seat":"5","category":"1","color":"#99ccff","price":9.6,"x":4354,"y":7107,"status":1040,"width":304,"seatName":""},{"row":"7","rowName":"7","seat":"6","category":"1","color":"#99ccff","price":9.6,"x":4050,"y":7107,"status":16,"width":305,"seatName":""},{"row":"7","rowName":"7","seat":"7","category":"1","color":"#99ccff","price":9.6,"x":3746,"y":7107,"status":16,"width":305,"seatName":""}],[{"row":"8","rowName":"8","seat":"1","category":"1","color":"#99ccff","price":9.6,"x":5570,"y":7699,"status":0,"width":304,"seatName":""},{"row":"8","rowName":"8","seat":"2","category":"1","color":"#99ccff","price":9.6,"x":5266,"y":7699,"status":0,"width":304,"seatName":""},{"row":"8","rowName":"8","seat":"3","category":"1","color":"#99ccff","price":9.6,"x":4962,"y":7699,"status":16,"width":304,"seatName":""},{"row":"8","rowName":"8","seat":"4","category":"1","color":"#99ccff","price":9.6,"x":4658,"y":7699,"status":16,"width":304,"seatName":""},{"row":"8","rowName":"8","seat":"5","category":"1","color":"#99ccff","price":9.6,"x":4354,"y":7699,"status":1024,"width":304,"seatName":""},{"row":"8","rowName":"8","seat":"6","category":"1","color":"#99ccff","price":9.6,"x":4050,"y":7699,"status":0,"width":305,"seatName":""},{"row":"8","rowName":"8","seat":"7","category":"1","color":"#99ccff","price":9.6,"x":3746,"y":7699,"status":0,"width":305,"seatName":""}],[{"row":"9","rowName":"9","seat":"1","category":"1","color":"#99ccff","price":9.6,"x":5570,"y":8291,"status":0,"width":304,"seatName":""},{"row":"9","rowName":"9","seat":"2","category":"1","color":"#99ccff","price":9.6,"x":5266,"y":8291,"status":0,"width":304,"seatName":""},{"row":"9","rowName":"9","seat":"3","category":"1","color":"#99ccff","price":9.6,"x":4962,"y":8291,"status":0,"width":304,"seatName":""},{"row":"9","rowName":"9","seat":"4","category":"1","color":"#99ccff","price":9.6,"x":4658,"y":8291,"status":0,"width":304,"seatName":""},{"row":"9","rowName":"9","seat":"5","category":"1","color":"#99ccff","price":9.6,"x":4354,"y":8291,"status":1024,"width":304,"seatName":""},{"row":"9","rowName":"9","seat":"6","category":"1","color":"#99ccff","price":9.6,"x":4050,"y":8291,"status":0,"width":305,"seatName":""},{"row":"9","rowName":"9","seat":"7","category":"1","color":"#99ccff","price":9.6,"x":3746,"y":8291,"status":0,"width":305,"seatName":""}],[{"row":"10","rowName":"10","seat":"1","category":"1","color":"#99ccff","price":9.6,"x":5494,"y":8882,"status":0,"width":304,"seatName":""},{"row":"10","rowName":"10","seat":"2","category":"1","color":"#99ccff","price":9.6,"x":5190,"y":8882,"status":0,"width":304,"seatName":""},{"row":"10","rowName":"10","seat":"3","category":"1","color":"#99ccff","price":9.6,"x":4886,"y":8882,"status":16,"width":304,"seatName":""},{"row":"10","rowName":"10","seat":"4","category":"1","color":"#99ccff","price":9.6,"x":4582,"y":8882,"status":1040,"width":304,"seatName":""},{"row":"10","rowName":"10","seat":"5","category":"1","color":"#99ccff","price":9.6,"x":4278,"y":8882,"status":0,"width":304,"seatName":""},{"row":"10","rowName":"10","seat":"6","category":"1","color":"#99ccff","price":9.6,"x":3974,"y":8882,"status":0,"width":305,"seatName":""},{"row":"10","rowName":"10","seat":"7","category":"1","color":"#99ccff","price":9.6,"x":3670,"y":8882,"status":0,"width":305,"seatName":""}],[{"row":"4","rowName":"4","seat":"7","category":"1","color":"#99ccff","price":9.6,"x":3746,"y":5331,"status":16,"width":305,"seatName":""}],[{"row":"5","rowName":"5","seat":"7","category":"1","color":"#99ccff","price":9.6,"x":3746,"y":5923,"status":16,"width":305,"seatName":""}]],"reductions":[{"reductionId":"0","reductionName":"Normalpreis","price":"\u20ac 0,00"},{"reductionId":"9","reductionName":"Kinder","price":"\u20ac 0,00"}],"selectedSeats":{"rows":"","seats":"","seatCount":0,"price":"\u20ac 0,00","reservationId":0,"reservationLimit":0,"reductions":[null],"startTime":1506018600000,"prgId":74726,"center":"Artis International","movieName":"The Circle OV","filmId":142426,"plan":"Saal 6","vipId":"0","resVipId":"0","pickupTime":0,"resType":0,"startString":"21.09.2017 20:30","success":true,"reductionIds":""},"movieCards":[],"isStarCard":false,"count":0,"children":0,"hasPreviousTickets":false})

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

# Starting dev (first time)

npm init => create empty package.json
npm install --save-dev request
npm install --save-dev cheerio

# Running the code

See also https://stackoverflow.com/questions/33535879/how-to-run-typescript-files-from-command-line for ts-node option

## Compile (and watch) Typescript:

    tsc -w cineplexx.ts

## Run:

    # save current html file
    wget -O cineplexx-programm.html "http://www.cineplexx.at/service/program.php?type=program&centerId=2&date=`date "+%Y-%m-%d"`&originalVersionTypeFilter=OV&sorting=alpha&undefined=Alle&view=detail"
    # run code
    node cineplexx

