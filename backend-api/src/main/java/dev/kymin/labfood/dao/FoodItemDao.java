package dev.kymin.labfood.dao;

import dev.kymin.labfood.dto.FoodItem;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;

@Repository
public class FoodItemDao {
    private final DataSource dataSource;

    public FoodItemDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public FoodItem addFoodItem(FoodItem foodItem) throws SQLException {
        String sql = "INSERT INTO items (item, price, img, person, deletedAt) VALUES (?, ?, ?, ?, ?)";
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setString(1, foodItem.getItem());
            stmt.setDouble(2, foodItem.getPrice());
            stmt.setString(3, foodItem.getImg());
            stmt.setLong(4, foodItem.getPerson());
            stmt.setTimestamp(5, foodItem.getDeletedAt() != null ?
                Timestamp.valueOf(foodItem.getDeletedAt()) : null);
            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    foodItem.setId(rs.getLong(1));
                }
            }
        }
        return foodItem;
    }

    public List<FoodItem> getAllFoodItems() throws SQLException {
        List<FoodItem> foodItems = new ArrayList<>();
        String sql = "SELECT * FROM items WHERE deletedAt IS NULL";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                FoodItem item = new FoodItem();
                item.setId(rs.getLong("id"));
                item.setItem(rs.getString("item"));
                item.setPrice(rs.getDouble("price"));
                item.setImg(rs.getString("img"));
                item.setPerson(rs.getLong("person"));
                Timestamp deletedAt = rs.getTimestamp("deletedAt");
                item.setDeletedAt(deletedAt != null ? deletedAt.toLocalDateTime() : null);
                foodItems.add(item);
            }
        }
        return foodItems;
    }

    public boolean updateFoodItem(FoodItem foodItem) throws SQLException {
        String sql = "UPDATE items SET item = ?, price = ?, person = ? WHERE id = ? AND deletedAt IS NULL";
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, foodItem.getItem());
            stmt.setDouble(2, foodItem.getPrice());
            stmt.setLong(3, foodItem.getPerson());
            stmt.setLong(4, foodItem.getId());
            
            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;
        }
    }

    public boolean deleteFoodItem(Long id) throws SQLException {
        String sql = "UPDATE items SET deletedAt = ? WHERE id = ? AND deletedAt IS NULL";
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setTimestamp(1, Timestamp.valueOf(LocalDateTime.now()));
            stmt.setLong(2, id);
            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;
        }
    }
}

