package dev.kymin.labfood.controller;

import dev.kymin.labfood.dto.Calculate;
import dev.kymin.labfood.service.CalculateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/calculates")
public class CalculateController {
    private final CalculateService calculateService;

    public CalculateController(CalculateService calculateService) {
        this.calculateService = calculateService;
    }

    @PostMapping
    public ResponseEntity<Calculate> addCalculate(@RequestBody Calculate calculate) {
        return ResponseEntity.ok(calculateService.addCalculate(calculate));
    }

    @GetMapping
    public ResponseEntity<List<Calculate>> getAllCalculates() {
        return ResponseEntity.ok(calculateService.getAllCalculates());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCalculate(@PathVariable Long id) {
        calculateService.deleteCalculate(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{personId}/complete")
    public ResponseEntity<Void> completeCalculate(@PathVariable Long personId) {
        calculateService.completeCalculate(personId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{personId}/summary")
    public ResponseEntity<Map<String, Object>> getCalculateSummary(@PathVariable Long personId) {
        return ResponseEntity.ok(calculateService.getCalculateSummary(personId));
    }

    @GetMapping("/unsettled-summary")
    public ResponseEntity<List<Map<String, Object>>> getUnsettledSummary() {
        return ResponseEntity.ok(calculateService.getUnsettledSummaryForAll());
    }
}