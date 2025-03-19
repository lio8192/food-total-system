package dev.kymin.labfood.service;

import dev.kymin.labfood.dao.CalculateDao;
import dev.kymin.labfood.dto.Calculate;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@Service
public class CalculateService {
    private final CalculateDao calculateDao;

    public CalculateService(CalculateDao calculateDao) {
        this.calculateDao = calculateDao;
    }

    public Calculate addCalculate(Calculate calculate) {
        try {
            return calculateDao.addCalculate(calculate);
        } catch (SQLException e) {
            throw new RuntimeException("Failed to add calculate", e);
        }
    }

    public List<Calculate> getAllCalculates() {
        try {
            return calculateDao.getAllCalculates();
        } catch (SQLException e) {
            throw new RuntimeException("Failed to fetch calculates", e);
        }
    }

    public void deleteCalculate(Long id) {
        try {
            if (!calculateDao.deleteCalculate(id)) {
                throw new RuntimeException("Calculate not found with id: " + id);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to delete calculate", e);
        }
    }

    public void completeCalculate(Long personId) {
        try {
            if (!calculateDao.completeCalculate(personId)) {
                throw new RuntimeException("No active calculations found for person: " + personId);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to complete calculate", e);
        }
    }

    public Map<String, Object> getCalculateSummary(Long personId) {
        try {
            return calculateDao.getCalculateSummary(personId);
        } catch (SQLException e) {
            throw new RuntimeException("Failed to get calculate summary", e);
        }
    }

    public List<Map<String, Object>> getUnsettledSummaryForAll() {
        try {
            return calculateDao.getUnsettledSummaryForAll();
        } catch (SQLException e) {
            throw new RuntimeException("Failed to get unsettled summary", e);
        }
    }
}