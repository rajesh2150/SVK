package com.svksweets.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record ProductRequest(
        @NotBlank(message = "Product name is required") String name,
        String description,
        String ingredients,
        String shelfLife,
        String storageInstructions,
        String deliveryTime,
        String weightOptions,
        @NotNull(message = "Price is required") BigDecimal price,
        @NotNull(message = "Stock is required") Integer stock,
        String imageUrl,
        List<String> galleryImages,
        boolean featured,
        boolean bestSeller,
        boolean active,
        Long categoryId
) {
}
