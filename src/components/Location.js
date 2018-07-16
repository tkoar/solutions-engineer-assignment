import React, { Component } from 'react'

class Location extends Component {

  state = {
    location: "",
  }

  getLocation = (event) => {
    event.preventDefault()
    if (!navigator.getLocation && this.state.location.length > 0) {
      this.geocodeAddress()
    } else if (this.state.location.length > 0) {
      this.geocodeAddress()
    } else if (!navigator.geolocation && this.state.location < 1) {
      alert("Sorry your browser does not support geolocation, please manually input your current location to locate restaurants near your location")
    } else {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({location: `${position['coords']['latitude']}, ${position['coords']['longitude']}`}, () => this.geocodeAddress())
      })
    }
  }

  geocodeAddress = () => {
    let address = this.state.location.split(" ").join("+")
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + address)
      .then(r => r.json())
      .then(json => {
        console.log(json)
        this.props.setLocation(json['results'][0]['geometry']['location'])
        this.setState({location: json['results'][0]['formatted_address']})
      })
  }

  handleLocationChange = (event) => {
    this.setState({location: event.target.value})
  }

  render() {
    return (
      <div className='search'>
        <form onSubmit={(event) => this.getLocation(event)} className="flex-row" style={{flexWrap: 'nowrap'}}>
          <input
            type='text'
            value={this.state.location}
            placeholder={"Address, City, Zip, or Point of Interest..."}
            onChange={(event) => this.handleLocationChange(event)}
            style={{maxWidth: '49vw', minWidth: '49vw'}}
            >
          </input>
          <input
            type='submit'
            value={"Set Your Location"}
            onClick={(event) => this.getLocation(event)}
            style={{maxWidth: '29vw', minWidth: '29vw', backgroundColor: 'lightgrey'}}
            >
          </input>
        </form>
      </div>
    )
  }

}

export default Location
