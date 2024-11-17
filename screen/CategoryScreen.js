import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CategoryScreen({ route, navigation }) {
  const { category, locations } = route.params;
  const filteredLocations = locations.filter(loc => loc.categoria === category);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categoría: {category}</Text>
      {filteredLocations.map((loc) => (
        <TouchableOpacity
          key={loc.id}
          style={styles.locationItem}
          onPress={() =>
            navigation.navigate('Mapa ucm', {
              latitude: loc.latitud,
              longitude: loc.longitud,
              nombre: loc.nombre,
              descripcion: loc.descripcion,
              imagen: loc.imagen
            })
          }
        >
          <Text>{loc.nombre} - {loc.descripcion}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9', 
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333', 
  },
  locationItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff', 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, 
  },
});
