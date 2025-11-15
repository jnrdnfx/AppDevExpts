// utils/favourites.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAV_KEY = "SPORTS_FAVOURITES";

export const getFavourites = async () => {
  try {
    const data = await AsyncStorage.getItem(FAV_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const addFavourite = async (item) => {
  const favs = await getFavourites();
  favs.push(item);
  await AsyncStorage.setItem(FAV_KEY, JSON.stringify(favs));
};

export const removeFavourite = async (item) => {
  let favs = await getFavourites();
  favs = favs.filter(f => f.id !== item.id || f.sport !== item.sport);
  await AsyncStorage.setItem(FAV_KEY, JSON.stringify(favs));
};
