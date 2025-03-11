import React, { useState, useEffect,useRef } from "react";
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
      hasScannedRef.current = false; ;
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
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Button title="Search" onPress={searchFood} />
          <Button title="Scan Barcode" onPress={openScanner} />

          <FlatList
            data={results}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => navigation.navigate("FoodDetailsScreen", { food: item, mealType })}
              >
                <Text style={styles.foodName}>{item.food_name} ({item.brand_name})</Text>
                <Text>{item.calories} kcal</Text>
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
          <Button title="Close Scanner" onPress={() => setScanning(false)} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10 },
  resultItem: { padding: 15, borderBottomWidth: 1 },
  foodName: { fontSize: 16, fontWeight: "bold" },
  cameraContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  camera: { width: "100%", height: "80%" },
});

export default FoodSearchScreen;
