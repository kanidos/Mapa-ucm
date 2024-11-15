import * as React from 'react';
import { Searchbar } from 'react-native-paper';

const BarraBusqueda = ({ onSearch }) => {  // Recibe la función onSearch
  const [searchQuery, setSearchQuery] = React.useState('');

  // Llama a la función onSearch con el valor de búsqueda
  const handleChangeText = (text) => {
    setSearchQuery(text);
    onSearch(text);  // Pasa el texto de la búsqueda a la función de filtro
  };

  return (
    <Searchbar
      placeholder="¿A Donde Quieres Ir?"
      onChangeText={handleChangeText}  // Usamos la nueva función
      value={searchQuery}
    />
  );
};

export default BarraBusqueda;
