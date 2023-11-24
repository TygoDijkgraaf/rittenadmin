package com.vitas.rittenadmin.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDateTime;

@ControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(value = {BadRequestException.class})
    @ResponseBody
    public ResponseEntity<Object> handleBadRequestException(BadRequestException e) {
        HttpStatus badRequest = HttpStatus.BAD_REQUEST;

        ApiException apiException = new ApiException(
                e.getMessage(),
                badRequest,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(apiException, badRequest);
    }
}
