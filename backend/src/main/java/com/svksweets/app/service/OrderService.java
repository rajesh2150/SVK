package com.svksweets.app.service;

import com.svksweets.app.dto.CheckoutRequest;
import com.svksweets.app.dto.OrderResponse;
import com.svksweets.app.entity.Order;
import com.svksweets.app.entity.OrderItem;
import com.svksweets.app.entity.Product;
import com.svksweets.app.exception.ResourceNotFoundException;
import com.svksweets.app.repository.OrderRepository;
import com.svksweets.app.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderResponse createOrder(CheckoutRequest request) {
        Order order = Order.builder()
                .orderNumber("SVK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .customerName(request.customerName())
                .phone(request.phone())
                .deliveryAddress(request.deliveryAddress())
                .paymentMethod(request.paymentMethod())
                .paymentStatus(request.paymentMethod().equalsIgnoreCase("RAZORPAY") ? "PENDING" : "COD")
                .totalAmount(request.totalAmount())
                .deliveryCharge(BigDecimal.ZERO)
                .trackingCode("TRK-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase())
                .createdAt(LocalDateTime.now())
                .build();

        for (CheckoutRequest.CartItemRequest cartItem : request.items()) {
            Product product = productRepository.findById(cartItem.productId()).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            OrderItem item = OrderItem.builder()
                    .product(product)
                    .quantity(cartItem.quantity())
                    .weightOption(cartItem.weightOption())
                    .unitPrice(product.getPrice())
                    .order(order)
                    .build();
            order.getItems().add(item);
        }

        orderRepository.save(order);
        return OrderResponse.from(order);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream().map(OrderResponse::from).toList();
    }

    public OrderResponse getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber);
        if (order == null) {
            throw new ResourceNotFoundException("Order not found");
        }
        return OrderResponse.from(order);
    }

    public List<OrderResponse> trackOrdersByPhone(String phone) {
        return orderRepository.findByPhone(phone).stream().map(OrderResponse::from).toList();
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
