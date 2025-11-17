import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVOURITES_KEY = '@app_favourites';

// Get all favourites from storage
export const getFavourites = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVOURITES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error reading favourites", e);
    return [];
  }
};

// Private helper function to save the full list
const saveFavourites = async (favs) => {
  try {
    const jsonValue = JSON.stringify(favs);
    await AsyncStorage.setItem(FAVOURITES_KEY, jsonValue);
  } catch (e) {
    console.error("Error saving favourites", e);
  }
};

// Add a new item to favourites
export const addFavourite = async (item) => {
  try {
    const currentFavs = await getFavourites();
    // Check for duplicates
    if (!currentFavs.find(f => f.id === item.id && f.sport === item.sport)) {
      const newFavs = [...currentFavs, item];
      await saveFavourites(newFavs);
    }
  } catch (e) {
    console.error("Error adding favourite", e);
  }
};

// Remove an item from favourites
export const removeFavourite = async (item) => {
  try {
    const currentFavs = await getFavourites();
    const newFavs = currentFavs.filter(f => !(f.id === item.id && f.sport === item.sport));
    await saveFavourites(newFavs);
  } catch (e) {
    console.error("Error removing favourite", e);
  }
};