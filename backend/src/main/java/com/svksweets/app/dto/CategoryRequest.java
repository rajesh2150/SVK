package com.svksweets.app.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequest(
        @NotBlank(message = "Category name is required") String name,
        String description,
        String imageUrl,
        boolean active
) {
}
