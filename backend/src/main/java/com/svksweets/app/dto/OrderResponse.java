package com.svksweets.app.dto;

import com.svksweets.app.entity.Order;
import com.svksweets.app.entity.OrderItem;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        String orderNumber,
        String customerName,
        String phone,
        String deliveryAddress,
        String status,
        String paymentMethod,
        String paymentStatus,
        BigDecimal totalAmount,
        BigDecimal deliveryCharge,
        String trackingCode,
        LocalDateTime createdAt,
        List<OrderItemResponse> items
) {
    public static OrderResponse from(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getCustomerName(),
                order.getPhone(),
                order.getDeliveryAddress(),
                order.getStatus(),
                order.getPaymentMethod(),
                order.getPaymentStatus(),
                order.getTotalAmount(),
                order.getDeliveryCharge(),
                order.getTrackingCode(),
                order.getCreatedAt(),
                order.getItems().stream().map(OrderItemResponse::from).toList()
        );
    }

    public record OrderItemResponse(Long productId, String productName, int quantity, String weightOption, BigDecimal unitPrice) {
        public static OrderItemResponse from(OrderItem item) {
            return new OrderItemResponse(item.getProduct().getId(), item.getProduct().getName(), item.getQuantity(), item.getWeightOption(), item.getUnitPrice());
        }
    }
}
