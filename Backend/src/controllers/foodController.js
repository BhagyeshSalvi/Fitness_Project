const axios = require("axios");
require("dotenv").config();
const Food = require("../models/Food");

// ✅ Search Food in Nutritionix & USDA
exports.searchFood = async (req, res) => {
    try {
        const { query } = req.params;
        
        // Check if query is a barcode (numeric value)
        const isBarcode = /^[0-9]+$/.test(query);

        if (isBarcode) {
            //  Search by barcode using Nutritionix
            const nutritionixResponse = await axios.get(
                `https://trackapi.nutritionix.com/v2/search/item?upc=${query}`,
                {
                    headers: {
                        "x-app-id": process.env.NUTRITIONIX_APP_ID,
                        "x-app-key": process.env.NUTRITIONIX_API_KEY,
                    },
                }
            );
            
            if (nutritionixResponse.data.foods.length > 0) {
                return res.json(formatNutritionixResponse(nutritionixResponse.data.foods));
            }
        } else {
            //  Search by food name using Nutritionix
            const nutritionixResponse = await axios.post(
                "https://trackapi.nutritionix.com/v2/natural/nutrients",
                { query },
                {
                    headers: {
                        "x-app-id": process.env.NUTRITIONIX_APP_ID,
                        "x-app-key": process.env.NUTRITIONIX_API_KEY,
                    },
                }
            );
            
            if (nutritionixResponse.data.foods.length > 0) {
                return res.json(formatNutritionixResponse(nutritionixResponse.data.foods));
            }
        }

        //  If Not Found in Nutritionix, Try USDA API as fallback
        const usdaResponse = await axios.get(
            `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&api_key=${process.env.USDA_API_KEY}`
        );

        if (usdaResponse.data.foods.length > 0) {
            return res.json(formatUsdaResponse(usdaResponse.data.foods));
        }

        res.status(404).json({ error: "Food not found in any database" });

    } catch (error) {
        console.error("❌ Error searching food:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

//  Log Food Entry & Update Daily Summary
exports.logFood = async (req, res) => {
    try {
        const { user_id, meal_type, food_name, brand_name, portion, unit, calories, protein, carbs, fats } = req.body;

        if (!user_id || !meal_type || !food_name || !portion || !unit) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

        // ✅ Step 1: Insert into food_entries
        await Food.logFoodEntry(user_id, today, meal_type, food_name, brand_name, portion, unit, calories, protein, carbs, fats);

        // ✅ Step 2: Update daily_summary
        await Food.updateDailySummary(user_id, today, calories, protein, carbs, fats);

        res.status(200).json({ message: "Food logged successfully!" });

    } catch (error) {
        console.error("❌ Error logging food:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getLoggedFood = async (req, res) => {
    try {
        const { userId, date } = req.params;

        //  Fetch food entries for the user on the selected date
        const foodLogs = await Food.getFoodEntriesByDate(userId, date);

        if (!foodLogs.length) {
            return res.status(200).json({ message: "No food logged for this date.", data: {} });
        }

        //  Group food by meal type
        let groupedLogs = { breakfast: [], lunch: [], dinner: [], snack: [] };
        foodLogs.forEach((entry) => {
            groupedLogs[entry.meal_type].push(entry);
        });

        res.status(200).json(groupedLogs);
    } catch (error) {
        console.error("❌ Error fetching logged food:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getDailySummary = async (req, res) => {
    try {
        const { userId, date } = req.params;

        //  Fetch daily macro summary from the database
        const summary = await Food.getDailySummaryByDate(userId, date);

        if (!summary) {
            return res.status(200).json({
                total_calories: 0,
                total_protein: 0,
                total_carbs: 0,
                total_fats: 0,
                message: "No food logged for this date.",
            });
        }

        res.status(200).json(summary);
    } catch (error) {
        console.error("❌ Error fetching daily summary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.deleteFood = async (req, res) => {
    try {
        const { userId, foodId, date } = req.body;

        //Call the model function to delete food entry
        const result = await Food.deleteFoodEntry(userId, foodId, date);

        res.status(200).json(result);
    } catch (error) {
        console.error("❌ Error deleting food:", error);
        
        if (error.message === "Food entry not found") {
            return res.status(404).json({ error: "Food entry not found" });
        }

        res.status(500).json({ error: "Internal server error" });
    }
};



//  Format Nutritionix API Response
const formatNutritionixResponse = (foods) => {
    return foods.map(food => ({
        food_name: food.food_name,
        brand_name: food.brand_name || "Generic",
        serving_size: food.serving_qty,
        unit: food.serving_unit,
        calories: food.nf_calories,
        protein: food.nf_protein,
        carbs: food.nf_total_carbohydrate,
        fats: food.nf_total_fat,
    }));
};

//  Format USDA API Response
const formatUsdaResponse = (foods) => {
    return foods.map(food => ({
        food_name: food.description,
        brand_name: "USDA",
        serving_size: 100, // USDA typically provides values per 100g
        unit: "g",
        calories: extractNutrient(food, 208),
        protein: extractNutrient(food, 203),
        carbs: extractNutrient(food, 205),
        fats: extractNutrient(food, 204),
    }));
};

//  Extract Nutrient Data from USDA API
const extractNutrient = (food, nutrientId) => {
    const nutrient = food.foodNutrients.find(n => n.nutrientId === nutrientId);
    return nutrient ? nutrient.value : 0;
};
