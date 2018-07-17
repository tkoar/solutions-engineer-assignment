import React, { Component } from 'react'
import SearchBar from './components/SearchBar'
import SideBar from './containers/SideBar'
import ResultList from './containers/ResultList'
import Location from './components/Location'
import {index, index_name, client} from './resources/SearchTools'
import './App.css'
const algoliasearchHelper = require('algoliasearch-helper')

class App extends Component {

  state = {
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

  // componentWillMount() {
  //   this.checkLocalStorage()
  // }

  componentDidMount() {
    this.setIndex()
    this.updateSearch()
  }

  // checkLocalStorage = () => {
  //   if (localStorage.getItem('prevSearchState')) {
  //     let prevState = localStorage.getItem('prevSearchState')
  //     this.setState({searchQuery: prevState.searchQuery, currentCuisine: prevState.currentCuisine, minRating: prevState.minRating, paymentType: prevState.paymentType}, this.updateSearch)
  //   } else {
  //     this.updateSearch()
  //   }
  // }

  // setLocalStorage = () => {
  //   localStorage.setItem('prevSearchState', JSON.stringify({searchQuery: this.state.searchQuery, currentCuisine: this.state.currentCuisine, minRating: this.state.minRating, paymentType: this.state.paymentType}))
  // }

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
    let helper = algoliasearchHelper(client, index_name, {facets: ["food_type"]})
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
      } else {
        return false
      }
    }
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
    let indexSettings = {
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
  }


  render() {
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
