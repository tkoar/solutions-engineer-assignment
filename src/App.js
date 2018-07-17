import React, { Component } from 'react'
import SearchBar from './components/SearchBar'
import SideBar from './containers/SideBar'
import ResultList from './containers/ResultList'
import Location from './components/Location'
import {index_name, app_id} from './resources/SearchTools'
import './App.css'
const algoliasearchHelper = require('algoliasearch-helper')
const algoliasearch = require('algoliasearch')

class App extends Component {

  state = {
    secure_key: '',
    pageNumber: 0,
    lat: undefined,
    lng: undefined,
    userLocationAccepted: undefined,
    searchQuery: "",
    searchResults: [],
    searchCount: undefined,
    searchTime: undefined,
    currentCuisine: undefined,
    minRating: 0,
    paymentType: undefined,
    cuisineTypes: []
  }

  componentDidMount() {
    this.setAPIKey()
  }

  setAPIKey() {
    fetch('https://restaurant-locator-server.herokuapp.com/auth/generate')
      .then(resp => resp.json())
      .then(json => this.setState({secure_key: json['secure_key']}, this.setIndex))
  }

  // -------- update functions -------
  updateSearchQuery = (searchQuery) => {
    this.setState({searchQuery: searchQuery, pageNumber: 0}, this.updateSearch)
  }

  updateBasedOnRating = (rating) => {
    this.setState({minRating: rating, pageNumber: 0}, this.updateSearch)
  }

  updateCuisine = (cuisine) => {
    if (cuisine) {
      this.setState({currentCuisine: cuisine.name, pageNumber: 0}, this.updateSearch)
    } else {
      this.setState({currentCuisine: null, pageNumber: 0}, this.updateSearch)
    }
  }

  updatePageNumber = () => {
    this.setState({pageNumber: this.state.pageNumber + 1}, this.updateSearch)
  }

  updatePaymentType = (paymentType) => {
    this.setState({paymentType: paymentType, pageNumber: 0}, this.updateSearch)
  }

  setLocation = ({lat, lng}) => {
    this.setState({lat: lat, lng: lng, pageNumber: 0}, this.updateSearch)
  }

  updateSearch = () => {
    let helper = algoliasearchHelper(this.state.client, index_name, {facets: ["food_type"]})
    if (this.state.currentCuisine) {
      helper.addFacetRefinement("food_type", this.state.currentCuisine)
    }
    if (this.state.lat && this.state.lng) {
      helper.setQueryParameter('getRankingInfo', true)
      helper.setQueryParameter('aroundLatLng',`${this.state.lat}, ${this.state.lng}`)
    }
    if (!this.state.lat && !this.state.lng) {
      helper.setQueryParameter('aroundLatLngViaIP', true)
    }
    helper.setQuery(this.state.searchQuery).search()
    this.updateStateWithSearchResults(helper)
  }

  updateStateWithSearchResults = (helper) => {
    let sliceTo = 3 + (this.state.pageNumber*3)
    helper.on("result", (content) => {
      let results = this.filterResults(content.hits)
      this.setState({
        searchResults: results.slice(0, sliceTo),
        searchCount: results.length,
        searchTime: content.processingTimeMS,
        cuisineTypes: content.getFacetValues("food_type")
      }, this.setLocalStorage)
    })
  }

// ----------------------------

  handleSuccessError = (error, content, action) => {
    if (error) {
      console.log("There was an error " + action + "!", error)
      throw error
    } else {
      console.log("Success " + action + "!", content)
    }
  }

  filterResultsBasedOnRating = (searchResults) => {
    const filteredResults = searchResults.filter((restaurant, idx) => {
      return Math.round(parseFloat(restaurant.stars_count)) >= parseFloat(this.state.minRating)
    })
    return filteredResults
  }

  filterResultsBasedPaymentType = (searchResults) => {
    const altPayments = ["Diners Club", "Carte Blanche"]
    return searchResults.filter((restaurant, idx) => {
      if (restaurant.payment_options.includes(this.state.paymentType)) {
        return true
      } else if (this.state.paymentType === 'Discover') {
        return this.checkToSeeIfIncludesAltPaymentTypes(altPayments, restaurant)
      }
      return false
    })
  }

  checkToSeeIfIncludesAltPaymentTypes = (altPaymentTypes, restaurant) => {
    for (var i = 0; i < altPaymentTypes.length; i++) {
      if (restaurant.payment_options.includes(altPaymentTypes[i])) {
        return true
      }
    }
    return false
  }

  filterResults = (searchResults) => {
    if (this.state.minRating && this.state.paymentType) {
      let filteredResults = []
      filteredResults = this.filterResultsBasedOnRating(searchResults)
      filteredResults = this.filterResultsBasedPaymentType(filteredResults)
      return filteredResults
    } else if (this.state.minRating) {
      return this.filterResultsBasedOnRating(searchResults)
    } else if (this.state.paymentType) {
      return this.filterResultsBasedPaymentType(searchResults)
    } else {
      return searchResults
    }
  }

  setIndex() {
    const client = algoliasearch(app_id, this.state.secure_key)
    const index = client.initIndex(index_name)
    const indexSettings = {
      'attributesForFaceting': ['food_type'],
      'sortFacetValuesBy': 'count',
      'searchableAttributes': ["name","food_type","city","area","neighborhood"],
      'ranking': ['typo','geo','words','attribute','proximity','exact','custom'],
      'hitsPerPage': 1000,
      'paginationLimitedTo': 5000
    }
    index.setSettings(
      indexSettings,
      (error, content) => this.handleSuccessError(error, content, "setting index settings")
    )
    this.setState({index: index, client: client}, this.updateSearch)
  }


  render() {
    console.log(this.state.key);
    return (
      <div className="App flex-row">
        <div className={'search-container'}>
          <SearchBar
            updateSearchQuery={this.updateSearchQuery}
          />
          <Location setLocation={this.setLocation}/>
        </div>
        <div className='flex-column' style={{backgroundColor: 'lightgrey'}}>
          <SideBar
            cuisines={this.state.cuisineTypes}
            updateCuisine={this.updateCuisine}
            updateBasedOnRating={this.updateBasedOnRating}
            updatePaymentType={this.updatePaymentType}
          />
          <ResultList
            searchTime={this.state.searchTime}
            searchCount={this.state.searchCount}
            results={this.state.searchResults}
            updatePageNumber={this.updatePageNumber}
          />
        </div>
      </div>
    );
  }
}

export default App;
