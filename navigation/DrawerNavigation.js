import React, { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screen/Map';
import CategoryScreen from '../screen/CategoryScreen';
import { getLocations } from '../http';

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedLocations = await getLocations();
      setLocations(fetchedLocations);

      const uniqueCategories = [...new Set(fetchedLocations.map(item => item.categoria))];
      setCategories(uniqueCategories);
    };

    fetchData();
  }, []);

  return (
    <Drawer.Navigator initialRouteName="Mapa ucm">
      <Drawer.Screen name="Mapa ucm" component={HomeScreen} />
      {categories.map((category, index) => (
        <Drawer.Screen
          key={index}
          name={category}
          component={CategoryScreen}
          initialParams={{ category, locations }}
        />
      ))}
    </Drawer.Navigator>
  );
}
