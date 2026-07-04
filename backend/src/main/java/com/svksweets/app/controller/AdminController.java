package com.svksweets.app.controller;

import com.svksweets.app.dto.ApiResponse;
import com.svksweets.app.dto.CategoryRequest;
import com.svksweets.app.dto.ProductRequest;
import com.svksweets.app.entity.Category;
import com.svksweets.app.entity.Product;
import com.svksweets.app.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin management APIs")
@CrossOrigin(origins = "*")
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get dashboard statistics")
    public ApiResponse dashboard() {
        return ApiResponse.success("Dashboard loaded", adminService.getDashboardStats());
    }

    @GetMapping("/categories")
    public ApiResponse listCategories() {
        return ApiResponse.success("Categories loaded", adminService.listCategories());
    }

    @PostMapping("/categories")
    public ApiResponse createCategory(@Valid @RequestBody CategoryRequest request) {
        return ApiResponse.success("Category created", adminService.createCategory(request));
    }

    @PutMapping("/categories/{id}")
    public ApiResponse updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        return ApiResponse.success("Category updated", adminService.updateCategory(id, request));
    }

    @DeleteMapping("/categories/{id}")
    public ApiResponse deleteCategory(@PathVariable Long id) {
        adminService.deleteCategory(id);
        return ApiResponse.success("Category deleted", null);
    }

    @GetMapping("/products")
    public ApiResponse listProducts() {
        return ApiResponse.success("Products loaded", adminService.listProducts());
    }

    @PostMapping("/products")
    public ApiResponse createProduct(@Valid @RequestBody ProductRequest request) {
        return ApiResponse.success("Product created", adminService.createProduct(request));
    }

    @PutMapping("/products/{id}")
    public ApiResponse updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ApiResponse.success("Product updated", adminService.updateProduct(id, request));
    }

    @DeleteMapping("/products/{id}")
    public ApiResponse deleteProduct(@PathVariable Long id) {
        adminService.deleteProduct(id);
        return ApiResponse.success("Product deleted", null);
    }
}
