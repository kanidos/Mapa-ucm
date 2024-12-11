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
              latitude: loc.latitude,
              longitude: loc.longitude,
              nombre: loc.nombre,
              descripcion: loc.descripcion,
              imagen: loc.imagen
            })
          }
        >
          <Text>{loc.nombre}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5', // Fondo gris claro para armonía
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#007AFF', // Azul para resaltar el título
  },
  locationItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#FFF', // Fondo blanco para las tarjetas
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#007AFF', // Borde azul para destacar las tarjetas
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3, // Efecto de elevación más definido
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333', // Texto en color oscuro para legibilidad
  },
});

