import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";

const FoodSearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { mealType } = route.params || {}; // Get meal type from params

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [scanning, setScanning] = useState(false);
  const hasScannedRef = useRef(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const searchFood = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await axios.get(`${API_URL}/api/food/search/${searchQuery}`);
      setResults(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        alert("Food not found.");
      } else {
        alert("Error searching food. Please try again later.");
      }
      console.error("Error searching food:", error.response?.data || error.message);
      setResults([]);
    }
  };

  const searchByBarcode = async (barcode) => {
    try {
      const response = await axios.get(`${API_URL}/api/food/search/${barcode}`);
      setResults(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        alert("Food not found for this barcode.");
      } else {
        alert("Error searching barcode. Please try again later.");
      }
      console.log("Error searching barcode:", error.response?.data || error.message);
      setResults([]);
    }
  };

  const handleBarcodeScan = ({ data }) => {
    if (hasScannedRef.current) return;

    console.log(`📸 Scanned Barcode: ${data}`);
    hasScannedRef.current = true;
    setScanning(false); // ✅ Close scanner immediately

    setSearchQuery(data);
    searchByBarcode(data);

    //  Reset scanning lock after 3 seconds
    setTimeout(() => {
      console.log("🔄 Resetting scanner...");
      hasScannedRef.current = false;;
    }, 3000);
  };


  const openScanner = () => {
    if (!permission?.granted) {
      alert("Camera permission is required to scan barcodes.");
      requestPermission();
      return;
    }

    setScanning(true);
  };

  return (
    <View style={styles.container}>
      {!scanning ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Search food or enter barcode"
            placeholderTextColor="#CCCCCC"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton} onPress={searchFood}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.scanButton} onPress={openScanner}>
            <Text style={styles.buttonText}>Scan Barcode</Text>
          </TouchableOpacity>

          <FlatList
            data={results}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => navigation.navigate("FoodDetailsScreen", { food: item, mealType })}
              >
                <Text style={styles.foodName}>{item.food_name} ({item.brand_name})</Text>
                <View style={styles.macroRow}>
                  <Text style={styles.proteinText}>P {Number(item.protein).toFixed(1)}g</Text>
                  <Text style={styles.carbText}>C {Number(item.carbs).toFixed(1)}g</Text>
                  <Text style={styles.fatText}>F {Number(item.fats).toFixed(1)}g</Text>
                  <Text style={styles.calorieText}>🔥 {Number(item.calories).toFixed(1)}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={hasScannedRef.current ? undefined : handleBarcodeScan} // Prevents multiple scans
          />
          <TouchableOpacity style={styles.closeButton} onPress={() => setScanning(false)}>
            <Text style={styles.buttonText}>Close Scanner</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({

  macroRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },

  proteinText: { color: '#FF4081', fontSize: 14 },   // Pink
  carbText: { color: '#42A5F5', fontSize: 14 },      // Blue
  fatText: { color: '#66BB6A', fontSize: 14 },       // Green
  calorieText: { color: '#FFA726', fontSize: 14 },   // Orange
  container: {
    flex: 1,
    backgroundColor: '#141414',
    padding: 20,
    paddingTop: 60,
  },

  input: {
    borderWidth: 1,
    borderColor: '#008080',
    backgroundColor: '#1e1e1e',
    color: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontFamily: 'Ponomar-Regular',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#008080',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  scanButton: {
    backgroundColor: '#008080',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Ponomar-Regular',
  },
  resultItem: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  foodName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Ponomar-Regular',
    marginBottom: 6,
  },
  calories: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Ponomar-Regular',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '80%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  closeButton: {
    backgroundColor: '#008080',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '60%',
  },
});


export default FoodSearchScreen;
