package com.svksweets.app.service;

import com.svksweets.app.dto.CategoryResponse;
import com.svksweets.app.dto.ProductResponse;
import com.svksweets.app.entity.Banner;
import com.svksweets.app.entity.Category;
import com.svksweets.app.entity.ContactInfo;
import com.svksweets.app.entity.Coupon;
import com.svksweets.app.entity.Product;
import com.svksweets.app.entity.Testimonial;
import com.svksweets.app.exception.ResourceNotFoundException;
import com.svksweets.app.repository.BannerRepository;
import com.svksweets.app.repository.CategoryRepository;
import com.svksweets.app.repository.ContactInfoRepository;
import com.svksweets.app.repository.CouponRepository;
import com.svksweets.app.repository.ProductRepository;
import com.svksweets.app.repository.TestimonialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CatalogService {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final BannerRepository bannerRepository;
    private final TestimonialRepository testimonialRepository;
    private final ContactInfoRepository contactInfoRepository;
    private final CouponRepository couponRepository;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findByActiveTrue().stream().map(CategoryResponse::from).toList();
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findByActiveTrue().stream().map(ProductResponse::from).toList();
    }

    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrue().stream().map(ProductResponse::from).toList();
    }

    public List<ProductResponse> getBestSellers() {
        return productRepository.findByBestSellerTrueAndActiveTrue().stream().map(ProductResponse::from).toList();
    }

    public List<ProductResponse> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCaseAndActiveTrue(keyword).stream().map(ProductResponse::from).toList();
    }

    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return productRepository.findByCategoryAndActiveTrue(category).stream().map(ProductResponse::from).toList();
    }

    public ProductResponse getProduct(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return ProductResponse.from(product);
    }

    public List<Banner> getActiveBanners() {
        return bannerRepository.findByActiveTrue();
    }

    public List<Testimonial> getActiveTestimonials() {
        return testimonialRepository.findByActiveTrue();
    }

    public ContactInfo getContactInfo() {
        return contactInfoRepository.findAll().stream().findFirst().orElseThrow(() -> new ResourceNotFoundException("Contact info not found"));
    }

    public Optional<Coupon> getCoupon(String code) {
        return couponRepository.findByCode(code);
    }
}
