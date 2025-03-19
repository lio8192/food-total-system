package dev.kymin.labfood.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class FoodItem {
    private Long id;
    private String item;
    private Double price;
    private String img;
    private Long person;
    private LocalDateTime deletedAt;
}