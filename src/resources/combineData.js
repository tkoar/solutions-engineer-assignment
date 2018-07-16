const FS = require('fs')
const restaurantsListJson = require('./dataset/restaurants_list.json')
const restaurantsInfoJson = csvToJSON()
const combinedRestaurantJSON = combineData(restaurantsInfoJson, restaurantsListJson)

function convertToJson(csvArry) {
  const headers = csvArry[0].split(";")
  let json = csvArry.map((restaurantInfo, idx) => {
    let resturant = restaurantInfo.split(";")
    let newObj = {}
    headers.forEach((header, index) => newObj[header] = resturant[index])
    return newObj
  })
  return json.slice(1,-1)
}

function csvToJSON() {
  let text = FS.readFileSync('src/resources/dataset/restaurants_info.csv', 'utf8', function(err, data) {
    if (err) {
      console.log(err)
    }
  })
  return convertToJson(text.split("\n"))
}

function combineData(restaurantInfo, restaurantList) {
  let sortedRestaurantInfo = restaurantInfo.sort(function(a, b) {
    return parseInt(a.objectID) - parseInt(b.objectID)
  })
  let sortedRestaurantList = restaurantList.sort((restaurant1, restaurant2) => {
    return parseInt(restaurant1.objectID) - parseInt(restaurant2.objectID)
  })
  return sortedRestaurantInfo.map((restaurant, idx) => {
    return Object.assign(restaurant, sortedRestaurantList[idx])
  })
}

function numbersParsedCombinedJson(json) {
  return json.map((el, i) => {
    if (el['stars_count'])
      el['stars_count'] = parseFloat(el['stars_count'])
    if (el['reviews_count'])
      el['reviews_count'] = parseInt(el['reviews_count'])
    return el
  })
}

FS.writeFile('src/resources/dataset/combined_restaurant_data_fixed.json', JSON.stringify(numbersParsedCombinedJson(combinedRestaurantJSON)), 'utf8', (err) => {
  if(err) {
    console.log(err)
  }
})
