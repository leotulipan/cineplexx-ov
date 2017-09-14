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

# Next Step

- line 138 
  build name, id object { name: 'Annabelle: Creation', id: '145027' } but for ALL movieId's
- get the Kino-Saal for each time slot
- technology + genre aus http://www.cineplexx.at/filme/jetzt-im-kino/
  - span3 data-tech + data-genre
  - span3 > p für die Namen
- film data: span6[1] > span3
    - url https://www.cineplexx.at/ticketing/?center=2&date=2017-09-12&movie=143827&prgid=74553
    - filter out Kino-Saal we dont like - room -desc
     
     https://www.cineplexx.at/rest/cinema/ticketMovieInfo?callback=info&center=2&movie=143827&date=2017-09-12&prgId=74553
      info({"date":"Heute, 12. September 2017","shortDate":"Heute, 12. Sep 2017","time":"20:45","technology":"Digital 2D","technologyId":1,"plan":"Saal 5","movieName":"Atomic Blonde","centerName":"Artis International","status":"green","category":"0","originalVersionType":"OV","prgCount":1,"events":[]})

    - build technology array - data-technology="1" (ticketing URL)
        #ticketing-content > div.row > div.span5 > div > p
    - build gentre array - data-genre="3 14"
        (http://www.cineplexx.at/film/atomic-blonde/
         .filmdetails > table > tbody > tr:nth-child(5) > td:nth-child(2)
           <td>Genre:</td>
						<td>Action, Thriller</td>

- show available showtimes for each day in a table sorted by film (not centerID)
- refactor to typescript
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

