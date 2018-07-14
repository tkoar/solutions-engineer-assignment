const algoliasearch = require('algoliasearch');
const algoliasearchHelper = require('algoliasearch-helper');
const combinedRestaurantJSON = require('./dataset/combined_restaurant_data.json')
import {index} from './SearchTools.js'

index.addObjects(combinedRestaurantJSON, (err, content) => {
  if(err) {
    console.log(err, "Content Not Added")
  } else {
    console.log(content,"Contents added to index successfully!")
  }
})
