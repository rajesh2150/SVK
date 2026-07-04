package com.svksweets.app.dto;

import com.svksweets.app.entity.Category;

public record CategoryResponse(Long id, String name, String slug, String description, String imageUrl, boolean active) {
    public static CategoryResponse from(Category category) {
        return new CategoryResponse(category.getId(), category.getName(), category.getSlug(), category.getDescription(), category.getImageUrl(), category.isActive());
    }
}
