const test = require('ava')
const Gtrends = require('./index')

test('test getHourlyStories', t => {
  // to easy generate a array of specs from the response that we got 
  // let specs = []; Object.keys(res).forEach((k,val) => specs.push({key: k, type: typeof(res[k])}));
  const specs = [
    { key: 'id', type: 'number' },
    { key: 'storyId', type: 'string' },
    { key: 'title', type: 'string' },
    { key: 'link', type: 'string' },
    { key: 'imgUrl', type: 'string' },
    { key: 'imgSrc', type: 'string' },
    { key: 'imgPost', type: 'string' },
    { key: 'tags', type: 'object' },
    { key: 'stories', type: 'object' }
  ];
  try {
    const gtrends = new Gtrends('US', 'all', 'EN-US');

    return gtrends.getHourlyStories().then(res => {
      Object.keys(res[0]).forEach((key, index) => {
        t.pass(typeof (res[key]), specs[index].type)
      })
    })

  } catch (err) {
    t.log(err)
    t.fail()
  }
})
