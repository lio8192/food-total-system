package dev.kymin.labfood.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/images")
public class ImageController {
    
    private final ResourceLoader resourceLoader;
    
    @Value("${spring.web.resources.static-locations:classpath:/static/}")
    private String staticPath;

    public ImageController(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // 파일 확장자 추출
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            
            // UUID를 사용하여 고유한 파일명 생성
            String filename = UUID.randomUUID().toString() + extension;
            
            // 정적 리소스 경로 생성
            Path resourcePath = Paths.get(resourceLoader.getResource(staticPath).getFile().getPath(), "images", filename);
            
            // 파일 저장
            Files.copy(file.getInputStream(), resourcePath);
            
            // JSON 응답 생성
            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", "/images/" + filename);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "파일 업로드 실패: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}