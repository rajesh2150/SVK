package com.svksweets.app.service;

import com.svksweets.app.dto.CategoryRequest;
import com.svksweets.app.dto.ProductRequest;
import com.svksweets.app.entity.Category;
import com.svksweets.app.entity.Product;
import com.svksweets.app.exception.ResourceNotFoundException;
import com.svksweets.app.repository.CategoryRepository;
import com.svksweets.app.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", productRepository.count());
        stats.put("totalCategories", categoryRepository.count());
        stats.put("featuredProducts", productRepository.findByFeaturedTrueAndActiveTrue().size());
        stats.put("bestSellers", productRepository.findByBestSellerTrueAndActiveTrue().size());
        return stats;
    }

    public List<Category> listCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(CategoryRequest request) {
        Category category = Category.builder()
                .name(request.name())
                .description(request.description())
                .imageUrl(request.imageUrl())
                .active(request.active())
                .slug(request.name().toLowerCase().replace(" ", "-"))
                .build();
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        category.setName(request.name());
        category.setDescription(request.description());
        category.setImageUrl(request.imageUrl());
        category.setActive(request.active());
        category.setSlug(request.name().toLowerCase().replace(" ", "-"));
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    public List<Product> listProducts() {
        return productRepository.findAll();
    }

    public Product createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.categoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Product product = Product.builder()
                .name(request.name())
                .description(request.description())
                .ingredients(request.ingredients())
                .shelfLife(request.shelfLife())
                .storageInstructions(request.storageInstructions())
                .deliveryTime(request.deliveryTime())
                .weightOptions(request.weightOptions())
                .price(request.price())
                .stock(request.stock())
                .imageUrl(request.imageUrl())
                .galleryImages(request.galleryImages() != null ? request.galleryImages() : List.of())
                .featured(request.featured())
                .bestSeller(request.bestSeller())
                .active(request.active())
                .category(category)
                .build();
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        Category category = categoryRepository.findById(request.categoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        product.setName(request.name());
        product.setDescription(request.description());
        product.setIngredients(request.ingredients());
        product.setShelfLife(request.shelfLife());
        product.setStorageInstructions(request.storageInstructions());
        product.setDeliveryTime(request.deliveryTime());
        product.setWeightOptions(request.weightOptions());
        product.setPrice(request.price());
        product.setStock(request.stock());
        product.setImageUrl(request.imageUrl());
        product.setGalleryImages(request.galleryImages() != null ? request.galleryImages() : List.of());
        product.setFeatured(request.featured());
        product.setBestSeller(request.bestSeller());
        product.setActive(request.active());
        product.setCategory(category);
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
