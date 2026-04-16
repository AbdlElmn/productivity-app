package com.elmn.SecurityLastChance.exception;

import org.springframework.http.HttpStatus;

public class EmailDeliveryException extends ApiException {

    public EmailDeliveryException(String message) {
        super(HttpStatus.SERVICE_UNAVAILABLE, message);
    }
}
