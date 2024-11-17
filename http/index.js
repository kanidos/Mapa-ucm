import axios from 'axios';

const URL = 'https://mapa-ucm-default-rtdb.firebaseio.com';

export async function getLocations() {
  try {
    const response = await axios.get(`${URL}/ubicacion.json`);

    console.log('Datos crudos obtenidos:', response.data);

    if (!response.data) {
      console.log('No se encontraron datos en la base de datos.');
      return [];
    }

    const locations = [];

    for (const key in response.data) {
      const item = response.data[key];
      if (item && item.nombre && item.descripcion && item.latitud && item.longitud) {
        const obj = {
          id: key,
          categoria: item.categoria,
          descripcion: item.descripcion,
          imagen: item.imagen,
          latitud: item.latitud,
          longitud: item.longitud,
          nombre: item.nombre,
        };
        locations.push(obj);
      } else {
        console.warn(`Dato inválido o nulo detectado en la clave: ${key}`, item);
      }
    }

    console.log('Datos obtenidos:', locations);
    return locations; 
  } catch (error) {
    console.error('Error al obtener las ubicaciones:', error);
    return [];
  }
}
