package com.svksweets.app.dto;

import com.svksweets.app.entity.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ProductResponse(
        Long id,
        String name,
        String description,
        String ingredients,
        String shelfLife,
        String storageInstructions,
        String deliveryTime,
        String weightOptions,
        BigDecimal price,
        Integer stock,
        String imageUrl,
        List<String> galleryImages,
        boolean featured,
        boolean bestSeller,
        boolean active,
        Double rating,
        Integer reviewCount,
        String categoryName,
        LocalDateTime createdAt
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getIngredients(),
                product.getShelfLife(),
                product.getStorageInstructions(),
                product.getDeliveryTime(),
                product.getWeightOptions(),
                product.getPrice(),
                product.getStock(),
                product.getImageUrl(),
                product.getGalleryImages(),
                product.isFeatured(),
                product.isBestSeller(),
                product.isActive(),
                product.getRating(),
                product.getReviewCount(),
                product.getCategory() != null ? product.getCategory().getName() : null,
                product.getCreatedAt()
        );
    }
}
