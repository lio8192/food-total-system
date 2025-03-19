package dev.kymin.labfood.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class Calculate {
    private Long id;
    private Long person;
    private Long item;
    private Integer count;
    private LocalDateTime createAt;
    private LocalDateTime calculateAt;
    private Double price;
    private LocalDateTime deletedAt;
    
    // 추가 필드 (조회용)
    private String personName;
    private String itemName;
    private String itemOwnerName;
    private String status;
}