package com.svksweets.app.controller;

import com.svksweets.app.dto.ApiResponse;
import com.svksweets.app.dto.PaymentVerificationRequest;
import com.svksweets.app.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ApiResponse createRazorpayOrder(@RequestParam String amount, @RequestParam(defaultValue = "INR") String currency) {
        return ApiResponse.success("Razorpay order created", paymentService.createOrder(amount, currency));
    }

    @PostMapping("/verify")
    public ApiResponse verify(@Valid @RequestBody PaymentVerificationRequest request) {
        return ApiResponse.success(paymentService.verifyPayment(request), null);
    }
}
