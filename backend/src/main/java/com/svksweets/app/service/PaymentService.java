package com.svksweets.app.service;

import com.svksweets.app.dto.PaymentVerificationRequest;
import com.svksweets.app.dto.RazorpayOrderResponse;
import com.svksweets.app.entity.Order;
import com.svksweets.app.entity.Payment;
import com.svksweets.app.exception.ResourceNotFoundException;
import com.svksweets.app.repository.OrderRepository;
import com.svksweets.app.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    public RazorpayOrderResponse createOrder(String amount, String currency) {
        return new RazorpayOrderResponse("razorpay_order_" + UUID.randomUUID(), currency, amount, "rzp_test_demo");
    }

    public String verifyPayment(PaymentVerificationRequest request) {
        Order order = orderRepository.findByOrderNumber(request.orderNumber());
        if (order == null) {
            throw new ResourceNotFoundException("Order not found");
        }

        String generatedSignature = generateSignature(request.razorpayOrderId(), request.razorpayPaymentId());
        boolean verified = generatedSignature.equals(request.razorpaySignature());

        Payment payment = Payment.builder()
                .providerOrderId(request.razorpayOrderId())
                .paymentId(request.razorpayPaymentId())
                .signature(request.razorpaySignature())
                .amount(order.getTotalAmount())
                .status(verified ? "SUCCESS" : "FAILED")
                .signatureVerified(verified)
                .order(order)
                .build();

        paymentRepository.save(payment);
        order.setPaymentStatus(verified ? "PAID" : "FAILED");
        order.setStatus(verified ? "Confirmed" : "Pending");
        orderRepository.save(order);
        return verified ? "Payment verified successfully" : "Payment verification failed";
    }

    private String generateSignature(String orderId, String paymentId) {
        String data = orderId + "|" + paymentId;
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec("demo_secret".getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hashBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashBytes);
        } catch (Exception ex) {
            throw new RuntimeException("Unable to generate signature", ex);
        }
    }
}
