package com.svksweets.app.controller;

import com.svksweets.app.dto.ApiResponse;
import com.svksweets.app.dto.CheckoutRequest;
import com.svksweets.app.entity.Order;
import com.svksweets.app.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/checkout")
    public ApiResponse checkout(@Valid @RequestBody CheckoutRequest request) {
        return ApiResponse.success("Order placed", orderService.createOrder(request));
    }

    @GetMapping("/all")
    public ApiResponse allOrders() {
        return ApiResponse.success("Orders loaded", orderService.getAllOrders());
    }

    @GetMapping("/track")
    public ApiResponse trackByPhone(@RequestParam String phone) {
        return ApiResponse.success("Orders tracked", orderService.trackOrdersByPhone(phone));
    }

    @GetMapping("/{orderNumber}")
    public ApiResponse getOrder(@PathVariable String orderNumber) {
        return ApiResponse.success("Order loaded", orderService.getOrderByNumber(orderNumber));
    }

    @PutMapping("/{id}/status")
    public ApiResponse updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ApiResponse.success("Order status updated", orderService.updateOrderStatus(id, status));
    }
}
