package dev.kymin.labfood.service;

import dev.kymin.labfood.dao.FoodItemDao;
import dev.kymin.labfood.dto.FoodItem;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

@Service
public class FoodService {
    private final FoodItemDao foodItemDao;

    public FoodService(FoodItemDao foodItemDao) {
        this.foodItemDao = foodItemDao;
    }

    public FoodItem addFoodItem(FoodItem foodItem) {
        try {
            return foodItemDao.addFoodItem(foodItem);
        } catch (SQLException e) {
            throw new RuntimeException("Failed to add food item", e);
        }
    }

    public List<FoodItem> getAllFoodItems() {
        try {
            return foodItemDao.getAllFoodItems();
        } catch (SQLException e) {
            throw new RuntimeException("Failed to fetch food items", e);
        }
    }

    public void updateFoodItem(FoodItem foodItem) {
        try {
            boolean updated = foodItemDao.updateFoodItem(foodItem);
            if (!updated) {
                throw new RuntimeException("Food item not found with id: " + foodItem.getId());
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to update food item", e);
        }
    }

    public void deleteFoodItem(Long id) {
        try {
            boolean deleted = foodItemDao.deleteFoodItem(id);
            if (!deleted) {
                throw new RuntimeException("Food item not found with id: " + id);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to delete food item", e);
        }
    }
}
