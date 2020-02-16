import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { Icon } from 'semantic-ui-react'
// import APIKey from './APIKey';

const boxStyle = {
  zIndex: '100',
  border: 'solid 1px black',
  backgroundColor: 'white',
  padding: '10px',
  width: '150px',
  borderRadius: '10px'
}

const iconStyle = {
  borderRadius: '100px',
  boxShadow: '3px 3px 1px #888888'
}

const InfoBox = (props) => {
  let googleMapLocation = "https://maps.google.com/?q=" + props.lat + ", " + props.lng
  let windowGoogleMap = `window.location= + ${googleMapLocation}`
console.log(props)
return (
  <div>
    <Popup trigger={<a target="_blank" href={googleMapLocation}><Icon onClick={windowGoogleMap} className="building icon" size='big' style={{transform: 'matrix(-1, 0, 0, 1, 10, 0)'}}/></a>} content={props.party} position='top center' style={{marginLeft: '8px', backgroundColor: 'AliceBlue', border: 'solid 1px light', textAlign: 'center'}}/>
  </div>
  )
}

const CurrentPin = ({text}) => {
  return(
    <div>
      <Icon name="user circle outline" color='blue' size='big' style={iconStyle}/>
      {text}
  </div>
  )
}

// const Marker = (color) => {  
//  return(
//     <div>
//       <Icon name="user" 
//        color={color}
//        size='big' 
//        style={iconStyle}
//       />
//      </div> 
//   )
// }

class PartyMap extends Component {

  state = {
    partyName: "",
    lat: "",
    lng: "",
    center: "",
    zoom: this.props.zoom,
    hover: false,
    currentPosition: false,
    infoBox: false
  }

  handleOnClick = () => {
    this.setState({
      clicked: !this.state.clicked
    })
  }

  componentWillMount = () =>{
    navigator.geolocation.getCurrentPosition(this.currentCoords)
  }

  currentCoords = (position) => {
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude
    this.setState({
      center: {lat: latitude, lng: longitude},
      currentPosition: true
    })
  }

  static defaultProps = {
    center: {
      lat: 37.2274,
      lng: -80.4222
    },
    zoom: 16
  };

  onChildMouseEnter = (num, childProps) => {
    if (childProps.party === undefined){
      return null
    } else {
      this.setState({
        facilityName: childProps.party.name,
        lat: childProps.lat,
        lng: childProps.lng,
        hover: true
      })
    }
  }

  onChildMouseLeave = (num, childProps) => {
    console.log("leaving")
    if (childProps.party === undefined){
      return null
    } else {

      this.setState({
        lat: "",
        lng: "",
        hover: false
      })
    }
  }

  InfoBoxOnClick = () => {
    console.log("clicked")
    this.setState({
      infoBox: !this.state.infoBox
    })
  }

  removeCenterAndZoom = () => {
    this.props.removeFacilityMapZoom()
    this.props.removeFacilityMapPosition()
  }

  render() {
    
    return (
       <GoogleMapReact
         bootstrapURLKeys={{
           key: apiKey.API_KEY,
           language: 'en',
         }}
        defaultCenter={this.props.center}
        center={setCenter}
        defaultZoom={this.props.zoom}
        zoom={setZoom}
        onChildMouseEnter={this.onChildMouseEnter}
        onChildMouseLeave={this.onChildMouseLeave}
        >
          {facilityPins}
          <CurrentPin
              lat={this.props.current.lat}
              lng={this.props.current.lng}
              text={'You'}
              />
            {infoBox}
            {this.props.currentFacilityPosition === "" && this.props.currentFacilityZoom === ""
              ? null
              : <Button onClick={this.removeCenterAndZoom} style={{float: 'left', backgroundColor: 'AliceBlue', margin: '5px', border: 'solid 1px black', fontSize: '100%', boxShadow: '3px 3px 1px #888888'}}><Icon className="compass" size="large" />re-center</Button>

            }
      </GoogleMapReact>
    );
  }
}

  // static defaultProps = {
  //   center: {
  //     lat: 37.2274,
  //     lng: -80.4222
  //   },
  //   zoom: 16
  // };
 
  render() {
    console.log(apiKey.API_KEY)
    let googleMapLocation = "https://maps.google.com/?q=" + this.props.lat + ", " + this.props.lng
    let windowGoogleMap = `window.location= + ${googleMapLocation}`

    const setCenter = this.props.currentFacilityPosition === "" || this.props.currentFacilityPosition === undefined ? (this.state.center) : (this.props.currentFacilityPosition)

    const setZoom = this.props.currentFacilityZoom === "" || this.props.currentFacilityZoom === undefined ? (this.props.zoom) : (this.props.currentFacilityZoom)

    const infoBox = this.state.hover === true ? <InfoBox lat={this.state.lat} lng={this.state.lng} party={this.state.facilityName} googleMapLocation={googleMapLocation} /> : null

    const partyPins = this.props.Parties.map((party, index) => {

      if (party.latitude === null || party.longitude === null){
        return null
      } else{
        return <PartyPin style={{width: '50px', height: '50px'}} key={index} onChildMouseEnter={this.onChildMouseEnter} onChildMouseLeave={this.onChildMouseLeave} party={party} hover={this.state.hover} lat={party.latitude} lng={party.longitude} />
      }
    })
    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "INSERT APIKEY" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          {/* <Marker
            lat={37.2274}
            lng={-80.4222}
            color={'red'}
          /> */}

        </GoogleMapReact>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentPosition: state.currentReducer.currentPosition,
    currentpartyPosition: state.facilitiesReducer.currentFacilityPosition,
    currentFacilityZoom: state.facilitiesReducer.currentFacilityZoom
  }
}

//export default PartyMap;
export default connect(mapStateToProps, { removePartyMapZoom, removePartyMapPosition })(PartyMap);