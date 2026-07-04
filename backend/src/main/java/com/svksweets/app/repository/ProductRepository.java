package com.svksweets.app.repository;

import com.svksweets.app.entity.Category;
import com.svksweets.app.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByActiveTrue();
    List<Product> findByFeaturedTrueAndActiveTrue();
    List<Product> findByBestSellerTrueAndActiveTrue();
    List<Product> findByCategoryAndActiveTrue(Category category);
    List<Product> findByNameContainingIgnoreCaseAndActiveTrue(String keyword);
}
