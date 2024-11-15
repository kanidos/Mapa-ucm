import * as React from 'react';
import { Searchbar } from 'react-native-paper';

const BarraBusqueda = ({ onSearch }) => { 
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleChangeText = (text) => {
    setSearchQuery(text);
    onSearch(text);  
  };

  return (
    <Searchbar
      placeholder="¿A Donde Quieres Ir?"
      onChangeText={handleChangeText}
      value={searchQuery}
    />
  );
};

export default BarraBusqueda;
