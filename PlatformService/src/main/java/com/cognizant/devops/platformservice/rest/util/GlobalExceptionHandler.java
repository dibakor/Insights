/*******************************************************************************
 * Copyright 2017 Cognizant Technology Solutions
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/
package com.cognizant.devops.platformservice.rest.util;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import com.google.gson.JsonObject;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Global exception handler to catch and log Spring MVC exceptions.
 * This helps debug issues with request body parsing in Spring Security 6.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LogManager.getLogger(GlobalExceptionHandler.class);

    /**
     * Handles HttpMessageNotReadableException - thrown when @RequestBody cannot be read.
     * This is the likely cause of HTTP 400 errors when request body is empty/consumed.
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<JsonObject> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex,
            HttpServletRequest request,
            WebRequest webRequest) {

        log.error("HttpMessageNotReadableException for URL: {} Method: {}",
                request.getRequestURI(), request.getMethod());
        log.error("Request class type: {}", request.getClass().getName());
        log.error("Content-Type: {}, Content-Length: {}",
                request.getContentType(), request.getContentLength());
        log.error("Exception message: {}", ex.getMessage());
        log.error("Root cause: {}", ex.getRootCause() != null ? ex.getRootCause().getMessage() : "null");
        log.error("Full exception: ", ex);

        JsonObject response = new JsonObject();
        response.addProperty("status", "failure");
        response.addProperty("message", "Unable to read request body: " + ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handles HttpMediaTypeNotSupportedException - thrown for HTTP 415 errors.
     */
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<JsonObject> handleHttpMediaTypeNotSupported(
            HttpMediaTypeNotSupportedException ex,
            HttpServletRequest request,
            WebRequest webRequest) {

        log.error("HttpMediaTypeNotSupportedException for URL: {} Method: {}",
                request.getRequestURI(), request.getMethod());
        log.error("Request class type: {}", request.getClass().getName());
        log.error("Content-Type: {}", request.getContentType());
        log.error("Supported media types: {}", ex.getSupportedMediaTypes());
        log.error("Exception message: {}", ex.getMessage());
        log.error("Full exception: ", ex);

        JsonObject response = new JsonObject();
        response.addProperty("status", "failure");
        response.addProperty("message", "Unsupported media type: " + ex.getMessage());

        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(response);
    }

    /**
     * Catch-all handler for any other exceptions during request processing.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<JsonObject> handleAllExceptions(
            Exception ex,
            HttpServletRequest request,
            WebRequest webRequest) {

        log.error("Unhandled exception for URL: {} Method: {}",
                request.getRequestURI(), request.getMethod());
        log.error("Request class type: {}", request.getClass().getName());
        log.error("Exception type: {}", ex.getClass().getName());
        log.error("Exception message: {}", ex.getMessage());
        log.error("Full exception: ", ex);

        JsonObject response = new JsonObject();
        response.addProperty("status", "failure");
        response.addProperty("message", "Error processing request: " + ex.getMessage());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
