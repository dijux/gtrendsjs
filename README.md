# gTrendsjs

is a non-official api wrapper to get latest trending news filterd by categories and countries, it is a sample and basic class which comsume multilple endpoints, the project started as basic a copied curl calls from the google trends webapp, then turned into this class, the library uses xml2json and got as dependecies to accomplish the goal.

it doesn't uses any cache system you will have to think about implementing cache for actual use.

## Features

- Get trending stories on google search by country and by category.
- Get single story details (timeline & other data )
- Fast and reliable – it uses the same servers that [trends.google.com](https://trends.google.com) uses


## Change Log
- [changelog.md](https://github.com/dijux/NODE_G_TRENDSJS/blob/master/CHANGELOG.md)

## How to install the library ? 

To install the library just type in 

`npm install gtrendsjs` 

or if you use yarn 

`yarn add gtrendsjs`

then require or import it in your javascript file

## Usage

take look at example.js and supported params 

- getting trending news  

```

const Gtrends = require('gtrends');

// accepts three params geo, category and lang
// geo supports one of these strings 'FR', 'EG', 'HK', 'IL', 'SA', 'TW', 'TH', 'TR', 'UK', 'US', 'VT'
// for the category 'all, business, entertainment, health, sicTech, sports, top'

const news = new Gtrends('US', 'all');
const latest = await news.getHourlyStories()

```

the response is format

Array of trending news stories as objects, each object contain also an array of similar story and other data 
```
[
  {
    "id": 0,
    "storyId": "US_lnk_fG_QSwEwAACtlM_en",
    "title": "Trending story title .... ",
    "link": "full link to the google trends story .... https://trends.google.com/",
    "imgUrl": "static img url provided",
    "imgSrc": "IMAGE SOURCE(PUBLISHER NAME)",
    "imgPost": "LINK TO IMAGE POST ARTICLE ",
    "tags": [
      "ARRAY OF TAGS TAG1",
      "TAG2", "TAG3"
    ],
    "stories": [
      {
        "id": 0,
        "title": "FIRST STORY TITLE ",
        "snippet": "STORY EXCERPT",
        "source": "SOURCE PUBLISHER NAME",
        "time": "52 minutes ago",
        "url": "FULL URL TO POST STORY"
      },
    ]
  },
  ... 
]

```


- getting single story 

```
const singleStory = new Grends("US", "category");
const storyData = await singleStory.getSingleStory("US_lnk_fG_QSwEwAACtlM_en");

```


### supports params 
```
supported categories : 'all, business, entertainment, health, sicTech, sports, top'
list of countries to use not all of them are supported ['FR', 'EG', 'HK', 'IL', 'SA', 'TW', 'TH', 'TR', 'UK', 'US', 'VT'];
```

### testing
the code is not well tested, but a basic test is written to verify if is library is getting the right data, to develop upon it in the future maybe !