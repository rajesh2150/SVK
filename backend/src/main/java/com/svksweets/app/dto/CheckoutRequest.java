package com.svksweets.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record CheckoutRequest(
        @NotBlank(message = "Customer name is required") String customerName,
        @NotBlank(message = "Phone number is required") String phone,
        @NotBlank(message = "Delivery address is required") String deliveryAddress,
        @NotBlank(message = "Payment method is required") String paymentMethod,
        @NotNull(message = "Total amount is required") BigDecimal totalAmount,
        List<CartItemRequest> items
) {
    public record CartItemRequest(Long productId, int quantity, String weightOption) {}
}
