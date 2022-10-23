
const Gtrends = require('./index');


// init
const gtrends = new Gtrends('FR', 'business', 'EN-US');


// // getting hourly trending stories

gtrends.getHourlyStories().then(trending => {
  // console.log(trending);
  // 
  console.log(trending[0].stories);
});


// getting singleStory data
// doesn't get the content but it gets all the data needed
// but if you want to digg more you can get all geo data 
// and other widgets using the token and request provided ( to be added in further updates ! probably )

// const singleStoryId = 'US_lnk_O4iWTAEwAACsdM_en';
// gtrends.getSingleStory(singleStoryId).then(storyData => {
//   console.log(storyData); 
// });


// get houry stories via pubic xml rss endpoint

// gtrends.getDailyGtrends().then(stories => {
//   console.log(stories)
// })
