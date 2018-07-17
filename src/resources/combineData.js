const FS = require('fs')
const restaurantsListJson = require('./dataset/restaurants_list.json')
const restaurantsInfoJson = csvToJSON()
const combinedRestaurantJSON = combineData(restaurantsInfoJson, restaurantsListJson)

function csvToJSON(file='src/resources/dataset/restaurants_info.csv') {
  let text = FS.readFileSync(file, 'utf8', (err, data) => {
    if (err) {
      console.log(err)
      console.log(`Failed to read ${file}`);
    }
  })
  const lines = text.split("\n")
  const cleanedData = cleanData(lines)
  return convertToJson(lines)
}

function convertToJson(csvArray) {
  const headers = csvArray[0].split(";") // create array with the value for each header, to use as keys
  const restaurantDataArray = csvArray.slice(1) // create separate array for data and remove headers
  let json = restaurantDataArray.map((restaurantInfo, idx) => {
    return createJsonObj(headers, restaurantInfo)
  })
  return json
}

function createJsonObj(headers, restuarantDataString) {
  const restaurant = restuarantDataString.split(";")
  return headers.reduce((acc, header, index) => {
    if (header === 'stars_count') {
      acc[header] = parseFloat(restaurant[index])
    } else if (header === 'reviews_count') {
      acc[header] = parseInt(restaurant[index])
    } else {
      acc[header] = restaurant[index]
    }
    return acc
  }, {})
}

function cleanData(dataArray) {
  return dataArray.filter((dataElement, idx) => !!dataElement)
}

function combineData(restaurantInfo, restaurantList) {
  let sortedRestaurantInfo = restaurantInfo.sort((a, b) => {
    return parseInt(a.objectID) - parseInt(b.objectID)
  })
  let sortedRestaurantList = restaurantList.sort((restaurant1, restaurant2) => {
    return parseInt(restaurant1.objectID) - parseInt(restaurant2.objectID)
  })
  return sortedRestaurantInfo.map((restaurant, idx) => {
    return Object.assign(restaurant, sortedRestaurantList[idx])
  })
}

// once the data from the CSV is parsed into JSON and combined with the existing JSON data
// we write the combined JSON to a new JSON file to use as our index's dataset
FS.writeFile('src/resources/dataset/combined_restaurant_data_fixed.json', JSON.stringify(combinedRestaurantJSON), 'utf8', (err) => {
  if(err) {
    console.log(err)
  }
})
