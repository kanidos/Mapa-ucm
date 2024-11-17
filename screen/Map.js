import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator} from 'react-native';
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
      setLocations(fetchedLocations);
      setFilteredLocations(fetchedLocations);

      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (route.params?.latitude && route.params?.longitude) {
      setLocation({
        latitude: route.params.latitude,
        longitude: route.params.longitude,
      });
      setSelectedLocation(route.params);
    }
  }, [route.params]);

  const handleLocationSelect = (location ) => { 
    setSelectedLocation(location);
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
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <>
          {errorMsg ? (
            <Text style={styles.errorText}>{errorMsg}</Text>
          ) : (
            <MapView
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
                  description={loc.descripcion}
                  icon={CategoryIcon[loc.categoria]}
                  onPress={() => handleLocationSelect(loc)}
                />
              ))}
            </MapView>
          )}
        </>
      )}
      <Modalize adjustToContentHeight childrenStyle={{ height: 370 }} ref={modalizeRef} snapPoint={300}>
        <View style={styles.panel}>
          {selectedLocation ? (
            <>
              <Image source={{ uri: selectedLocation.imagen }} style={styles.image} />
              <Text style={styles.panelTitle}>{selectedLocation.nombre}</Text>
              <Text style={styles.panelDescription}>{selectedLocation.descripcion}</Text>
            </>
          ) : (
            <Text style={styles.panelPlaceholder}>
              Selecciona una ubicación para ver más detalles
            </Text>
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
  },
  map: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  panel: {
      justifyContent: 'flex-start',
      padding: 20,
      backgroundColor: '#ffffff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: 300,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.2,
      shadowRadius: 15,
    },
    panelTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 15,
      color: '#2c3e50', 
    },
    panelDescription: {
      fontSize: 16,
      color: '#555', 
      lineHeight: 22, 
    },
    panelPlaceholder: {
      fontSize: 16,
      color: '#aaa', 
      fontStyle: 'italic', 
    },
    image: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
      marginTop: 15,
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5, 
    },
  });
  