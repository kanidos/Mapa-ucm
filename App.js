import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from './navigation/DrawerNavigation';

export default function App() {
  const [categories, setCategories] = useState([]);

  return (
    <NavigationContainer>
      <DrawerNavigation categories={categories} setCategories={setCategories} />
    </NavigationContainer>
  );
}
