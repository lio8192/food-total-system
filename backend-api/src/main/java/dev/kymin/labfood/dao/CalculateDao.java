package dev.kymin.labfood.dao;

import dev.kymin.labfood.dto.Calculate;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Repository
public class CalculateDao {
    private final DataSource dataSource;

    public CalculateDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public Calculate addCalculate(Calculate calculate) throws SQLException {
        String sql = "INSERT INTO calculate (person, item, count, price, createAt) VALUES (?, ?, ?, ?, ?)";
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setLong(1, calculate.getPerson());
            stmt.setLong(2, calculate.getItem());
            stmt.setInt(3, calculate.getCount());
            stmt.setDouble(4, calculate.getPrice());
            stmt.setTimestamp(5, Timestamp.valueOf(LocalDateTime.now()));
            
            stmt.executeUpdate();

            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    calculate.setId(rs.getLong(1));
                }
            }
        }
        return calculate;
    }

    public List<Calculate> getAllCalculates() throws SQLException {
        List<Calculate> calculates = new ArrayList<>();
        String sql = """
            SELECT c.*, u.name as person_name, i.item as item_name, 
                   u2.name as item_owner_name
            FROM calculate c
            JOIN users u ON c.person = u.id
            JOIN items i ON c.item = i.id
            JOIN users u2 ON i.person = u2.id
            WHERE i.deletedAt IS NULL
            ORDER BY c.createAt DESC;
        """;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Calculate calc = new Calculate();
                calc.setId(rs.getLong("id"));
                calc.setPerson(rs.getLong("person"));
                calc.setItem(rs.getLong("item"));
                calc.setCount(rs.getInt("count"));
                calc.setPrice(rs.getDouble("price"));
                calc.setCreateAt(rs.getTimestamp("createAt").toLocalDateTime());
                
                Timestamp calculateAt = rs.getTimestamp("calculateAt");
                Timestamp deletedAt = rs.getTimestamp("deletedAt");
                
                calc.setCalculateAt(calculateAt != null ? calculateAt.toLocalDateTime() : null);
                calc.setDeletedAt(deletedAt != null ? deletedAt.toLocalDateTime() : null);
                
                calc.setPersonName(rs.getString("person_name"));
                calc.setItemName(rs.getString("item_name"));
                calc.setItemOwnerName(rs.getString("item_owner_name"));
                
                if (deletedAt != null) {
                    calc.setStatus("비활성화");
                } else if (calculateAt != null) {
                    calc.setStatus("정산완료");
                } else {
                    calc.setStatus("활성상태");
                }
                
                calculates.add(calc);
            }
        }
        return calculates;
    }

    public boolean deleteCalculate(Long id) throws SQLException {
        String sql = "UPDATE calculate SET deletedAt = ? WHERE id = ? AND deletedAt IS NULL";
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setTimestamp(1, Timestamp.valueOf(LocalDateTime.now()));
            stmt.setLong(2, id);
            
            return stmt.executeUpdate() > 0;
        }
    }

    public boolean completeCalculate(Long personId) throws SQLException {
        String sql = "UPDATE calculate SET calculateAt = ? WHERE person = ? AND calculateAt IS NULL AND deletedAt IS NULL";
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setTimestamp(1, Timestamp.valueOf(LocalDateTime.now()));
            stmt.setLong(2, personId);
            
            return stmt.executeUpdate() > 0;
        }
    }

    public Map<String, Object> getCalculateSummary(Long personId) throws SQLException {
        String sql = """
            SELECT i.person as owner_id, u.name as owner_name, 
                   SUM(c.count) as total_count, 
                   SUM(c.count * c.price) as total_price
            FROM calculate c
            JOIN items i ON c.item = i.id
            JOIN users u ON i.person = u.id
            WHERE c.person = ? AND c.calculateAt IS NULL AND c.deletedAt IS NULL
            GROUP BY i.person, u.name
        """;

        Map<String, Object> summary = new HashMap<>();
        List<Map<String, Object>> details = new ArrayList<>();
        double grandTotal = 0;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, personId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> detail = new HashMap<>();
                    detail.put("ownerName", rs.getString("owner_name"));
                    detail.put("totalCount", rs.getInt("total_count"));
                    detail.put("totalPrice", rs.getDouble("total_price"));
                    
                    details.add(detail);
                    grandTotal += rs.getDouble("total_price");
                }
            }
        }

        summary.put("details", details);
        summary.put("grandTotal", grandTotal);
        
        return summary;
    }

    public List<Map<String, Object>> getUnsettledSummaryForAll() throws SQLException {
        String sql = """
            SELECT c.person as person_id, u.name as person_name,
                   i.person as owner_id, u2.name as owner_name,
                   SUM(c.count * c.price) as amount
            FROM calculate c
            JOIN users u ON c.person = u.id
            JOIN items i ON c.item = i.id
            JOIN users u2 ON i.person = u2.id
            WHERE c.calculateAt IS NULL AND c.deletedAt IS NULL
            GROUP BY c.person, u.name, i.person, u2.name
        """;

        Map<Long, Map<String, Object>> summaryMap = new HashMap<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Long personId = rs.getLong("person_id");
                String personName = rs.getString("person_name");
                Long ownerId = rs.getLong("owner_id");
                String ownerName = rs.getString("owner_name");
                double amount = rs.getDouble("amount");

                Map<String, Object> personSummary = summaryMap.get(personId);
                if (personSummary == null) {
                    personSummary = new HashMap<>();
                    personSummary.put("personId", personId);
                    personSummary.put("personName", personName);
                    personSummary.put("totalUnsettled", 0.0);
                    personSummary.put("ownerAmounts", new ArrayList<Map<String, Object>>());
                    summaryMap.put(personId, personSummary);
                }
                double currentTotal = (double) personSummary.get("totalUnsettled");
                personSummary.put("totalUnsettled", currentTotal + amount);

                @SuppressWarnings("unchecked")
                List<Map<String, Object>> ownerAmounts = (List<Map<String, Object>>) personSummary.get("ownerAmounts");
                Map<String, Object> ownerDetail = new HashMap<>();
                ownerDetail.put("ownerId", ownerId);
                ownerDetail.put("ownerName", ownerName);
                ownerDetail.put("amount", amount);
                ownerAmounts.add(ownerDetail);
            }
        }

        return new ArrayList<>(summaryMap.values());
    }
}