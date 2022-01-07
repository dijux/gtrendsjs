// gTrends Class
// Non-official api to google trends
const got = require("got");
const parser = require('xml2json');
const userAgents = require("user-agents");
const CATEGORIES = {
  all: "all",
  business: "b",
  entertainment: "e",
  health: "h",
  sicTech: "t",
  sports: "s",
  top: "t",
}
const COUNTRIES = ['FR', 'EG', 'HK', 'IL', 'SA', 'TW', 'TH', 'TR', 'UK', 'US', 'VT'];

class Gtrends {

  constructor(geo = "US", category = "all", lang = "en-US") {
    try {

      if (COUNTRIES.includes(geo)) {
        this.geo = geo;
      }
      if (CATEGORIES[category]) {
        this.category = category;
      }
      this.lang = lang;
      // this.keyword = keyword;
      this.timeZone = "-60";
      this.hourlyApiUrl = `https://trends.google.com/trends/api/realtimetrends?hl=${this.lang}&tz=${this.timeZone}&cat=${this.category}&fi=0&fs=0&geo=${this.geo}&ri=300&rs=20&sort=0`;
      this.dailyXmlUrl = `https://trends.google.com/trends/trendingsearches/daily/rss?geo=${this.geo}`;
      this.trendsApiUrl = `https://trends.google.com/trends/api/explore/examples?hl=${this.lang}&tz=${this.timeZone}&geo=${this.geo}`;
      this.topdailyApiUrl = `https://trends.google.com/trends/api/topdailytrends?hl=${this.lang}&tz=${this.timeZone}&geo=${this.geo}`;
      this.referUrl = `https://trends.google.com/trends/?geo=${this.geo}`;
      this.xmlHeaders = {
        "Content-type": "application/xml"
      };

      this.jsonHeaders = {
        "content-type": "application/json",
        "accept": "application/json, text/plain, */*",
        "authority": "trends.google.com",
        "user-agent": new userAgents({ deviceCategory: 'desktop' }).toString(),
        "sec-fetch-site": "cross-origin",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
        "referer": this.referUrl,
        "accept-language": "en-US,en;q=0.9"
      };

      this.cleanStr = {
        default: ``,
        trend_example: `)]}'`,
        topdaily_trends: `)]}',`,
        single_story: ``
      };

      this.currentType = "";
      this.currentEndpoint = "";
      this.currentName = "";

    } catch (err) {
      throw err.message
    }

  }


  /*
  ** Basic string cleaner to develop more in the future
  ** @param the raw response from unofficial api
  ** @return string 
  */
  cleanJsonResponse(result) {
    if (this.currentType === "single_story_data")
      return result.replace(`)]}'`, "");
    if (this.currentType === "hourly_trends")
      return result.replace(`)]}'`, "");
    // remove these strings either way
    return result.replace(`)]}',`, "").replace(`)]}'`, "");
  }

  /**
   * pverall wrapper to calls
   * response depending on the request data get converted &
   * @returns  return json object
   */
  async gFetchApi() {
    if (this.currentEndpoint && this.currentName && this.currentType) {
      let jsonData
      // xml_daily_trends
      if (this.currentType === 'daily_xml_trends') {

        const body = await got(this.dailyXmlUrl, {
          headers: this.xmlHeaders
        }).text();

        jsonData = parser.toJson(body, {
          object: true,
          reversible: false,
          coerce: false,
          sanitize: true,
          trim: true,
          arrayNotation: false,
          alternateTextNode: false
        });

      }

      // call for hourly trends 
      if (this.currentType === 'hourly_trends') {
        jsonData = await got(this.currentEndpoint, {
          headers: this.jsonHeaders
        }).text();

        jsonData = this.cleanGrendStories(JSON.parse(this.cleanJsonResponse(jsonData)))
      }

      //  call for single story
      if (this.currentType === 'single_story_data') {
        jsonData = await got(this.currentEndpoint, {
          headers: this.jsonHeaders
        }).text();
        jsonData = this.formatSingleStory(JSON.parse(this.cleanJsonResponse(jsonData)))
      }

      // this will have to cache the call 
      // depending on the type of query 

      return jsonData;
    }
    return false;
  }

  /*
  ** single story format
  */
  formatSingleStory(data) {
    return data;
  }


  /**
  * clean the repsonse got from google trends 
  * @param json resonse object of xml parse
  * @return json object {id, storyId, title, description, similar ... }
  */
  cleanXmlRepsonse(res) {
    let latest = res.rss.channel.item.map((tmpItem, i) => {
      let similar = []
      if (tmpItem['ht:news_item'].length > 1) {
        similar = tmpItem['ht:news_item'].map((el, key) => {
          return {
            id: key,
            title: el['ht:news_item_title'],
            snippet: el['ht:news_item_snippet'],
            url: el['ht:news_item_url'],
            source: el['ht:news_item_source']
          }
        })
        // for (const key in tmpItem['ht:news_item']) {
        //   if (Object.hasOwnProperty.call(tmpItem['ht:news_item'], key)) {
        //     const el = tmpItem['ht:news_item'][key];
        //     similar.push()    
        //   }
        // }
      }
      // case of getting one similar story 
      similar.push({
        id: 0,
        title: tmpItem['ht:news_item']['ht:news_item_title'],
        snippet: tmpItem['ht:news_item']['ht:news_item_snippet'],
        url: tmpItem['ht:news_item']['ht:news_item_url'],
        source: tmpItem['ht:news_item']['ht:news_item_source']
      })
      return {
        id: i,
        title: tmpItem['title'],
        description: tmpItem['descriprion'],
        traffic: tmpItem['ht:approx_traffic'],
        image: tmpItem['ht:picture'],
        link: tmpItem['link'],
        pubDate: tmpItem['pubDate'],
        image_source: tmpItem['ht:picture_source'],
        similar: similar
      }
    });

    return latest
  }

  /*
  ** @param object response of trending stories
  ** @return object cleaned {id, storyId, title, description, similar ... }
  */
  cleanGrendStories(data) {
    return data.storySummaries.trendingStories.map((story, key) => {
      return {
        id: key,
        storyId: story.id,
        title: story.title,
        link: story.shareUrl,
        imgUrl: story.image.imgUrl || null,
        imgSrc: story.image.source,
        imgPost: story.image.newsUrl,
        tags: story.entityNames,
        stories: story.articles.map((post, idx) => {
          return {
            id: idx,
            title: post.articleTitle,
            snippet: post.snippet,
            source: post.source,
            time: post.time,
            url: post.url
          }
        })
      }
    })
  }

  /**
  * gets the daily google trends from xml endpoint
  * 
  */
  getDailyGtrends() {
    this.currentName = "example_trends";
    this.currentType = "daily_xml_trends";
    this.currentEndpoint = this.trendsApiUrl;

    return new Promise(async (resolve, reject) => {
      try {

        let latest = await this.gFetchApi();
        latest = this.cleanXmlRepsonse(latest);

        resolve(latest)

      } catch (err) {
        reject(err)
      }
    });
  }

  /*
  ** get trendings news hourly based from json endpoint 
  ** ( basically it is the response contains some additionals
  **  strings which prevent the returned data to be parsed as json ... see func cleanGrendStroies )
  */
  getHourlyStories() {
    this.currentName = "hourly_news_trends_";
    this.currentType = "hourly_trends";
    this.currentEndpoint = this.hourlyApiUrl;

    return new Promise(async (resolve, reject) => {
      try {
        let hourly = await this.gFetchApi()
        resolve(hourly);
      } catch (err) {
        reject(err);
      }
    });

  }

  /** 
  * Get the single story data
  * @param string storyId
  * @returs object storyData 
  */
  getSingleStory(storyId) {
    this.currentName = 'single_story_';
    this.currentType = 'single_story_data';
    this.currentEndpoint = `https://trends.google.com/trends/api/stories/${storyId}?hl=${this.lang}&tz=${this.timeZone}`;
    return new Promise(async (resolve, reject) => {
      try {
        let storyData = await this.gFetchApi();
        resolve(storyData);
      } catch (err) {
        if (err) {
          reject(err)
        }
      }
    })
  }
}

module.exports = Gtrends;
