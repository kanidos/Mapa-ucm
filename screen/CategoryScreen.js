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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
});
