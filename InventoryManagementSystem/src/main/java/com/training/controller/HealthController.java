package com.training.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
@CrossOrigin(origins = "http://localhost:3001")
@RestController
public class HealthController {

    @GetMapping("/health")
    public String health() {
        return "Inventory Service is UP";
    }
}