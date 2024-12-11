import React, { useEffect, useState, useRef } from 'react'; 
import { StyleSheet, View, Text, Image, ActivityIndicator, Linking, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Modalize } from 'react-native-modalize';
import { getLocations } from '../http';
import { cleanMapStyle } from '../components/cleanMap';
import BarraBusqueda from '../components/BarraBusqueda';
import { CategoryIcon } from '../components/MarkerIcons';

export default function HomeScreen({ route }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const modalizeRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Se necesita el permiso de ubicación para mostrar el mapa.');
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      const fetchedLocations = await getLocations();
      if (Array.isArray(fetchedLocations)) {
        setLocations(fetchedLocations);
        setFilteredLocations(fetchedLocations);
      } else {
        console.error('getLocations no devolvió un array válido');
      }

      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (route.params?.latitude && route.params?.longitude) {
      const { latitude, longitude } = route.params;
      setLocation({ latitude, longitude });
      setSelectedLocation(route.params);

      mapRef.current?.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  }, [route.params]);

  const handleLocationSelect = (location) => {
    if (selectedLocation?.id !== location.id) {
      setSelectedLocation(location);
      mapRef.current?.animateToRegion(
        {
          latitude: location.latitud,
          longitude: location.longitud,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      modalizeRef.current?.open();
    }
  }, [selectedLocation]);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredLocations(locations);
      return;
    }

    const filtered = locations.filter((loc) =>
      loc.nombre.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredLocations(filtered);
  };

  

  return (
    <View style={styles.container}>
      <BarraBusqueda onSearch={handleSearch} />
      {loading ? (
        <ActivityIndicator size="large" color="#0046A5" />
      ) : (
        <>
          {errorMsg ? (
            <Text style={styles.errorText}>{errorMsg}</Text>
          ) : (
            <MapView
              ref={mapRef}
              style={styles.map}
              region={{
                latitude: -35.43558628681802,
                longitude: -71.61994639627318,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsUserLocation={true}
              followsUserLocation={true}
              customMapStyle={cleanMapStyle}
            >
              {filteredLocations.map((loc) => (
                <Marker
                  key={loc.id}
                  coordinate={{ latitude: loc.latitud, longitude: loc.longitud }}
                  title={loc.nombre}
                  icon={CategoryIcon[loc.categoria]}
                  onPress={() => handleLocationSelect(loc)}
                />
              ))}
            </MapView>
          )}
        </>
      )}
      <Modalize
        ref={modalizeRef}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
        }}
        adjustToContentHeight
      >
        <View style={{ padding: 20 }}>
          {selectedLocation ? (
            <>
              <Image source={{ uri: selectedLocation.imagen }} style={styles.imageEnhanced} />
              <Text style={styles.panelTitleEnhanced}>{selectedLocation.nombre}</Text>
              <Text style={styles.panelSubtitle}>{selectedLocation.descripcion}</Text>
              <TouchableOpacity
                style={styles.googleMapsButtonEnhanced}
                onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${selectedLocation.latitud},${selectedLocation.longitud}`)}
              >
                <Text style={styles.googleMapsButtonTextEnhanced}>Abrir en Google Maps</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.panelPlaceholder}>Selecciona una ubicación para ver más detalles</Text>
          )}
        </View>
      </Modalize>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  imageEnhanced: {
    width: '100%',
    height: 180,
    borderRadius: 15,
    marginBottom: 15,
  },
  panelTitleEnhanced: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0046A5',
  },
  panelSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 20,
    lineHeight: 22,
  },
  googleMapsButtonEnhanced: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#0046A5',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    elevation: 0,
    shadowOpacity: 0,
  },
  googleMapsButtonTextEnhanced: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  panelPlaceholder: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});





