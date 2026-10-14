package com.training.test;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.training.MaterialServiceApplication;

@SpringBootTest(classes = MaterialServiceApplication.class)
@ActiveProfiles("test")
class MaterialServiceApplicationTests {

    @Test
    void contextLoads() {
    }
}