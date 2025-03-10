import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "@env";
import { CameraView, useCameraPermissions } from "expo-camera";

const FoodSearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { mealType } = route.params || {};
  const [searchQuery, setSearchQuery] = useState("");
  const [foodResults, setFoodResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      if (!permission || permission.status !== "granted") {
        const { status } = await requestPermission();
        if (status === "granted") {
          console.log("Camera permission granted");
        } else {
          console.log("Camera permission denied");
        }
      }
    })();
  }, [permission]);

  useEffect(() => {
    console.log("Camera permissions:", permission);
    console.log("Scanning state:", scanning);
  }, [permission, scanning]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/food/search/${searchQuery}`);
      setFoodResults(response.data);
    } catch (error) {
      console.error("Error fetching food data:", error);
    }
    setLoading(false);
  };

  const handleBarcodeScanned = async ({ type, data }) => {
    if (!data) return;
    
    console.log("📸 Scanning triggered! Type:", type, "Data:", data);
    
    setScanning(false); //Immediately stop scanning to prevent duplicate scans
    setLoading(true);
  
    try {
      const response = await axios.get(`${API_URL}/api/food/search/${data}`);
      if (response.data) {
        navigation.navigate("FoodDetailScreen", { food: response.data });
      } else {
        alert("❌ Food not found! Try manually searching.");
      }
    } catch (error) {
      console.error("⚠️ Error fetching barcode data:", error);
    }
    
    setLoading(false);
    setTimeout(() => setScanning(true), 1500); // Re-enable scanning after a short delay
  };
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search food..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {/* Scan Barcode Button */}
      <TouchableOpacity
        onPress={() => {
          if (!permission?.granted) {
            requestPermission();
          } else {
            console.log("Opening scanner...");
            setScanning(false); // Reset first
            setTimeout(() => setScanning(true), 500); // Re-enable scanner after a short delay
          }
        }}
        style={styles.scanButton}
      >
        <Text style={styles.buttonText}>📷 Scan Barcode</Text>
      </TouchableOpacity>

      {/* Barcode Scanner */}
      {scanning && permission?.granted && (
        <View style={styles.overlay}>
          <CameraView
            style={styles.cameraView}
            barcodeScannerSettings={{
              barCodeTypes: [
                "qr", "ean13", "upc_a", "code128", "code39", "code93", "itf14", "ean8", "pdf417"
              ]
            }}
            onBarcodeScanned={(scanning ? handleBarcodeScanned : undefined)}
            
          />

          <TouchableOpacity onPress={() => setScanning(false)} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {/* Food List */}
      <FlatList
        data={foodResults}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("FoodDetailScreen", { food: item,mealType })}>
            <Text style={styles.foodItem}>{item.food_name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  searchButton: { backgroundColor: "#007AFF", padding: 10, borderRadius: 5, alignItems: "center", marginBottom: 10 },
  scanButton: { backgroundColor: "#28A745", padding: 10, borderRadius: 5, alignItems: "center", marginBottom: 10 },
  buttonText: { color: "white", fontWeight: "bold" },
  foodItem: { fontSize: 16, padding: 10, borderBottomWidth: 1 },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)" },
  cameraView: { width: "100%", height: 400 },
  closeButton: { backgroundColor: "red", padding: 10, marginTop: 20, borderRadius: 5 },
  closeText: { color: "white", fontWeight: "bold" },
});

export default FoodSearchScreen;