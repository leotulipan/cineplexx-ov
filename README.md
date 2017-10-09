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

 Now managed in a public [Trello Board](https://trello.com/b/ST4mBUic/githubcom-leotulipan-cineplexx-ov)

            
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

