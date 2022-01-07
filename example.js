
const Gtrends = require('./index');


// init
const gtrends = new Gtrends('US', 'all', 'EN-US');

// // getting hourly stories
gtrends.getHourlyStories().then(stories => {

  console.log(stories);

});


// getting singleStory data
// doesn't get the content but it gets all the data needed
// but if you want to digg more you can get all geo data 
// and other widgets using the token and request provided ( to be added in further updates ! probably )

const singleStoryId = 'US_lnk_O4iWTAEwAACsdM_en';
gtrends.getSingleStory(singleStoryId).then(storyData => {

  console.log(storyData); 

});

