package dev.kymin.labfood.controller;

import dev.kymin.labfood.dto.FoodItem;
import dev.kymin.labfood.service.FoodService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
public class FoodController {
    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @PostMapping
    public ResponseEntity<FoodItem> addFoodItem(@RequestBody FoodItem foodItem) {
        return ResponseEntity.ok(foodService.addFoodItem(foodItem));
    }

    @GetMapping
    public ResponseEntity<List<FoodItem>> getAllFoodItems() {
        return ResponseEntity.ok(foodService.getAllFoodItems());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateFoodItem(@PathVariable Long id, @RequestBody FoodItem foodItem) {
        foodItem.setId(id);
        foodService.updateFoodItem(foodItem);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFoodItem(@PathVariable Long id) {
        foodService.deleteFoodItem(id);
        return ResponseEntity.noContent().build();
    }
}
