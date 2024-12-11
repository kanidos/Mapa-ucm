import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { getLocations } from '../http/index';
import { useNavigation } from '@react-navigation/native'; // Importa el hook

const BarraBusqueda = () => {
  const navigation = useNavigation(); // Obtiene el objeto de navegación
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getLocations();
      setLocations(data);
    };

    fetchData();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.length > 0) {
      const filtered = locations.filter((location) =>
        location.nombre.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]);
    }
  };

  const handleSuggestionPress = (location) => {
    setSearchQuery(location.nombre);
    setFilteredLocations([]);
    navigation.navigate('Mapa ucm', {
      latitude: location.latitude,
      longitude: location.longitude,
      nombre: location.nombre,
      descripcion: location.descripcion,
      imagen: location.imagen,
    });
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar ubicación..."
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchbar}
        inputStyle={styles.inputStyle}
        iconColor="#007AFF"
      />
      {filteredLocations.length > 0 && (
        <FlatList
          data={filteredLocations}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSuggestionPress(item)} style={styles.suggestionItem}>
              <Text>{item.nombre}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 60,
    zIndex: 1,
  },
  searchbar: {
    borderRadius: 25,
    elevation: 4,
    backgroundColor: '#F5F5F5', // Fondo gris claro
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#007AFF', // Borde azul
  },
  inputStyle: {
    fontSize: 16,
    color: '#333', // Texto oscuro
  },
  suggestionsList: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    elevation: 4,
    marginTop: 5,
    maxHeight: 150,
    borderColor: '#007AFF', // Borde azul
    borderWidth: 1,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default BarraBusqueda;