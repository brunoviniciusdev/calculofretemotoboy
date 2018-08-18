import React, { Component } from 'react';
import './App.css';
import Map from './Map/Map';
import Form from './Form/Form';
import { Container, Alert } from 'reactstrap';
import ReactGA from 'react-ga';
import { directionsDefault } from './Map/defaultDirections';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      toastDefaultProps: {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      },
      origin: 'Torre de TV, Brasília',
      destination: 'Esplanada dos Ministérios',
      isSubmited: false,
      directions: directionsDefault,
      distance: undefined
    };
  }

  componentDidMount() {
    // Google Analytics
    ReactGA.initialize('UA-121994767-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  searchOrigin = e => {
    const value = e.target.value;
    this.setState({
      errorRequisition: false,
      origin: value,
      isSubmited: false
    });
  };

  searchDestination = e => {
    const value = e.target.value;
    this.setState({
      errorRequisition: false,
      destination: value,
      isSubmited: false
    });
  };

  calc = () => {
    const DirectionsService = new window.google.maps.DirectionsService();

    DirectionsService.route(
      {
        origin: this.state.origin,
        destination: this.state.destination,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (res, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: res,
            distance: (res.routes[0].legs[0].distance.value / 1000) | 0,
            price: (res.routes[0].legs[0].distance.value / 1000) * 1.9 + 3,
            isSubmited: true
          });
        } else {
          // console.error('Erro de requisição', res)
          this.setState({ errorRequisition: true });
        }
      }
    );
    this.setState({
      isSubmited: true
    });
  };

  submitEnter = e => {
    if (e.keyCode === 13) {
      this.calc();
    }
  };

  render() {
    const keyGmaps = 'AIzaSyBZJDUkG83bcVMgdRoJPOotgt0v305l6W4';
    const {
      directions,
      price,
      distance,
      toastDefaultProps,
      errorRequisition
    } = this.state;
    return (
      <div className="App">
        <Container fluid>
          <Form
            searchOrigin={e => this.searchOrigin(e)}
            searchDestination={e => this.searchDestination(e)}
            calc={() => this.calc()}
            submitEnter={e => this.submitEnter(e)}
          />

          <div className="mapa-xbs">
            <Map
              googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${keyGmaps}&v=3.exp&libraries=geometry,drawing,places`}
              loadingElement={<div style={{ height: '100vh' }} />}
              containerElement={<div style={{ height: '100vh' }} />}
              mapElement={<div style={{ height: '100vh' }} />}
              directions={directions}
            />
          </div>

          {distance >= 1 && (
            <Alert className="success-search" color="success">
              Distância: {distance} km – Valor total:{' '}
              {price.toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL'
              })}
            </Alert>
          )}

          {errorRequisition &&
            toast.error(
              'Houve um erro. Verifique o endereço digitado.',
              toastDefaultProps
            )}

          {distance === 0 &&
            toast.error('A distância minima é de 1km!', toastDefaultProps)}
        </Container>
        <ToastContainer />
      </div>
    );
  }
}

export default App;