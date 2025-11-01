import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Image,
  ScrollView,
  Alert,
  SafeAreaView // NOW IMPORTED FROM 'react-native'
} from 'react-native';
// Removed: import { SafeAreaView } from 'react-native-safe-area-context'; 
// Fix for: Module not found: Can't resolve 'react-native-safe-area-context'

// Note: Icon libraries like 'lucide-react' are not standard in RN.
// We use simple text/emoji or platform components (like ActivityIndicator)
// or dedicated RN icon libraries (like @expo/vector-icons), 
// but we will stick to basic components here for minimum dependencies.

// Utility to define type colors
const typeColors = {
  Normal: '#A8A878', Fire: '#F08030', Water: '#6890F0', Grass: '#78C850',
  Electric: '#F8D030', Ice: '#98D8D8', Fighting: '#C03028', Poison: '#A040A0',
  Ground: '#E0C068', Flying: '#A890F0', Psychic: '#F85888', Bug: '#A8B820',
  Rock: '#B8A038', Ghost: '#705898', Dragon: '#7038F8', Steel: '#B8B8D0',
  Dark: '#705848', Fairy: '#EE99AC',
};

// --- Helper Component: TypeBadge ---
const TypeBadge = ({ type }) => {
  const color = typeColors[type] || '#6B7280'; // Default to gray
  
  return (
    <View style={[styles.typeBadge, { backgroundColor: color }]}>
      <Text style={styles.typeText}>
        {type}
      </Text>
    </View>
  );
};

// --- MAIN COMPONENT: App ---
export default function App() {
  const [searchText, setSearchText] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Fetches Pokémon data from the PokéAPI.
   */
  const searchPokemon = async () => {
    if (!searchText.trim()) {
      Alert.alert('Search Required', 'Please enter a Pokémon name or ID.');
      return;
    }

    setIsLoading(true);
    setPokemonData(null); 

    const query = searchText.toLowerCase().trim();
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${query}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        if (response.status === 404) {
          Alert.alert('Not Found', `Pokémon "${searchText}" not found. Try an exact name or ID.`);
        } else {
          Alert.alert('API Error', `An error occurred: Status ${response.status}`);
        }
        return;
      }

      const data = await response.json();

      // Extract and format data
      const extractedData = {
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        id: data.id,
        // Use the front_default sprite
        imageUrl: data.sprites.front_default, 
        types: data.types.map(typeInfo => ({
          name: typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1),
          slot: typeInfo.slot,
        })),
        weight: data.weight / 10, // Convert decigrams to kg
        height: data.height / 10, // Convert decimetres to m
      };
      
      setPokemonData(extractedData);

    } catch (err) {
      console.error('Fetch error:', err);
      Alert.alert('Network Error', 'A network error occurred. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Renders the Pokémon details card upon successful search.
   */
  const renderPokemonCard = () => {
    if (!pokemonData) return null;

    // FIX for missing local asset: Use a public URL for the placeholder image.
    const PUBLIC_POKEBALL_URL = 'https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg'; 
    
    // Use the fetched URL or the public placeholder URL.
    const finalImageUrl = pokemonData.imageUrl 
      ? { uri: pokemonData.imageUrl } 
      : { uri: PUBLIC_POKEBALL_URL };

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {pokemonData.name} 
          <Text style={styles.cardSubtitle}> #{String(pokemonData.id).padStart(3, '0')}</Text>
        </Text>
        
        <Image
          style={styles.pokemonImage}
          source={finalImageUrl}
          resizeMode="contain"
        />
        
        <View style={styles.typesContainer}>
          {pokemonData.types.map((type) => (
            <TypeBadge key={type.slot} type={type.name} />
          ))}
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Height:</Text>
            <Text style={styles.detailValue}>{pokemonData.height} m</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Weight:</Text>
            <Text style={styles.detailValue}>{pokemonData.weight} kg</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Pokédex Search</Text>

        {/* --- Search Bar and Button --- */}
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter Pokémon name or ID (e.g., pikachu, 6)"
            placeholderTextColor="#6B7280"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={searchPokemon} // Triggers search on keyboard 'Done'/'Enter'
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={searchPokemon}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.searchButtonText}>Search</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* --- Pokemon Card Result --- */}
        {!isLoading && renderPokemonCard()}

      </ScrollView>
    </SafeAreaView>
  );
}

// --- StyleSheet for React Native ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#afff59ff', // light gray background
  },
  container: {
    marginTop: 20,
    alignItems: 'center',
    padding: 20,
    minHeight: '100%',
  },
  header: {
    fontSize: 32,
    fontWeight: '900',
    color: '#dc2629ff', // Red color
    marginBottom: 20,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  // Search Bar Styling
  searchBarContainer: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8, // Android shadow
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#1F2937',
  },
  searchButton: {
    backgroundColor: '#3B82F6', // Blue
    paddingHorizontal: 20,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Card Styling
  card: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#4726dcff', // Red border
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 15, // Android shadow
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  cardSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
  },
  pokemonImage: {
    width: 150,
    height: 150,
    marginVertical: 15,
  },
  typesContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  typeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  detailsContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '700',
    marginTop: 2,
  }
});
