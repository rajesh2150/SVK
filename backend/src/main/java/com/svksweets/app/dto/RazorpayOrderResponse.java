package com.svksweets.app.dto;

public record RazorpayOrderResponse(String orderId, String currency, String amount, String key) {
}
