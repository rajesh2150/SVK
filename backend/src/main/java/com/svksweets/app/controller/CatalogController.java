package com.svksweets.app.controller;

import com.svksweets.app.dto.ApiResponse;
import com.svksweets.app.dto.CategoryResponse;
import com.svksweets.app.dto.ProductResponse;
import com.svksweets.app.entity.Banner;
import com.svksweets.app.entity.ContactInfo;
import com.svksweets.app.entity.Coupon;
import com.svksweets.app.entity.Testimonial;
import com.svksweets.app.service.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Catalog", description = "Public catalog APIs")
@CrossOrigin(origins = "*")
public class CatalogController {
    private final CatalogService catalogService;

    @GetMapping("/catalog/categories")
    @Operation(summary = "Get all active categories")
    public ApiResponse getCategories() {
        return ApiResponse.success("Categories loaded", catalogService.getAllCategories());
    }

    @GetMapping("/catalog/products")
    @Operation(summary = "Get all active products")
    public ApiResponse getProducts() {
        return ApiResponse.success("Products loaded", catalogService.getAllProducts());
    }

    @GetMapping("/catalog/featured")
    public ApiResponse getFeatured() {
        return ApiResponse.success("Featured products loaded", catalogService.getFeaturedProducts());
    }

    @GetMapping("/catalog/bestsellers")
    public ApiResponse getBestSellers() {
        return ApiResponse.success("Best sellers loaded", catalogService.getBestSellers());
    }

    @GetMapping("/catalog/products/search")
    public ApiResponse searchProducts(@RequestParam String q) {
        return ApiResponse.success("Search results loaded", catalogService.searchProducts(q));
    }

    @GetMapping("/catalog/categories/{categoryId}/products")
    public ApiResponse getProductsByCategory(@PathVariable Long categoryId) {
        return ApiResponse.success("Products for category loaded", catalogService.getProductsByCategory(categoryId));
    }

    @GetMapping("/catalog/products/{id}")
    public ApiResponse getProduct(@PathVariable Long id) {
        return ApiResponse.success("Product loaded", catalogService.getProduct(id));
    }

    @GetMapping("/public/banners")
    public ApiResponse getBanners() {
        return ApiResponse.success("Banners loaded", catalogService.getActiveBanners());
    }

    @GetMapping("/public/testimonials")
    public ApiResponse getTestimonials() {
        return ApiResponse.success("Testimonials loaded", catalogService.getActiveTestimonials());
    }

    @GetMapping("/public/contact")
    public ApiResponse getContactInfo() {
        return ApiResponse.success("Contact info loaded", catalogService.getContactInfo());
    }

    @GetMapping("/public/coupons/{code}")
    public ApiResponse getCoupon(@PathVariable String code) {
        Optional<Coupon> coupon = catalogService.getCoupon(code);
        return coupon.map(value -> ApiResponse.success("Coupon found", value)).orElseGet(() -> ApiResponse.error("Coupon not found"));
    }
}
