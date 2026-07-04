package com.svksweets.app.config;

import com.svksweets.app.entity.*;
import com.svksweets.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final BannerRepository bannerRepository;
    private final TestimonialRepository testimonialRepository;
    private final ContactInfoRepository contactInfoRepository;
    private final CouponRepository couponRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            Category kova = categoryRepository.save(Category.builder().name("Kova / Khova").slug("kova-khova").description("Rich and creamy milk sweets").imageUrl("https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=900&q=80").active(true).build());
            Category milk = categoryRepository.save(Category.builder().name("Milk Sweets").slug("milk-sweets").description("Traditional milk-based sweets").imageUrl("https://images.unsplash.com/photo-1610048686080-ac0974d1d4f1?auto=format&fit=crop&w=900&q=80").active(true).build());
            Category dryfruit = categoryRepository.save(Category.builder().name("Dry Fruit Sweets").slug("dry-fruit-sweets").description("Premium dry fruit delicacies").imageUrl("https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=900&q=80").active(true).build());

            productRepository.saveAll(List.of(
                    Product.builder().name("Kova Peda").description("Classic soft peda made with fresh milk and cardamom").ingredients("Milk, sugar, cardamom").shelfLife("3 days refrigerated").storageInstructions("Store in airtight container").deliveryTime("Same day delivery").weightOptions("250g,500g,1kg").price(new BigDecimal("420")).stock(25).imageUrl("https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=900&q=80").galleryImages(List.of("https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=900&q=80")).featured(true).bestSeller(true).active(true).category(kova).build(),
                    Product.builder().name("Badam Burfi").description("Rich almond burfi glazed with silver leaf").ingredients("Almonds, milk, sugar").shelfLife("7 days").storageInstructions("Keep cool and dry").deliveryTime("Next day delivery").weightOptions("250g,500g,1kg").price(new BigDecimal("680")).stock(18).imageUrl("https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=900&q=80").galleryImages(List.of("https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=900&q=80")).featured(true).active(true).category(dryfruit).build(),
                    Product.builder().name("Rasgulla Deluxe").description("Soft spongy rasgulla with floral syrup").ingredients("Chenna, sugar, rose essence").shelfLife("5 days refrigerated").storageInstructions("Refrigerate after opening").deliveryTime("Same day delivery").weightOptions("250g,500g,1kg").price(new BigDecimal("360")).stock(30).imageUrl("https://images.unsplash.com/photo-1587241321921-91a834d6d191?auto=format&fit=crop&w=900&q=80").galleryImages(List.of("https://images.unsplash.com/photo-1587241321921-91a834d6d191?auto=format&fit=crop&w=900&q=80")).bestSeller(true).active(true).category(milk).build()
            ));
        }

        if (bannerRepository.count() == 0) {
            bannerRepository.save(Banner.builder().title("Festival Grand Offer").subtitle("Handcrafted sweets for every celebration").imageUrl("https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=1600&q=80").link("/products").active(true).build());
        }

        if (testimonialRepository.count() == 0) {
            testimonialRepository.save(Testimonial.builder().customerName("Priya N").location("Chennai").message("Elegant packaging and authentic taste. Highly recommended").rating(5).active(true).build());
        }

        if (contactInfoRepository.count() == 0) {
            contactInfoRepository.save(ContactInfo.builder().shopName("SVK Sweets").phone("+91 98765 43210").email("hello@svksweets.com").address("12, Anna Salai, Chennai").whatsapp("+91 98765 43210").hours("Everyday 8 AM - 10 PM").mapUrl("https://maps.google.com").build());
        }

        if (couponRepository.count() == 0) {
            couponRepository.save(Coupon.builder().code("WELCOME10").discountPercent(10).minOrderAmount(new BigDecimal("500")).active(true).build());
        }

        if (adminRepository.count() == 0) {
            adminRepository.save(Admin.builder().username("admin").password(passwordEncoder.encode("admin123")).build());
        }
    }
}
