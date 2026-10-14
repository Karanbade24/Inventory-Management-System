package com.training.test.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.training.service.UnitService;

@SpringBootTest
@ActiveProfiles("test")
public class UnitServiceTest {

    @Autowired
    private UnitService unitService;

    @Test
    public void notNullUnitServiceTest() {
        assertNotNull(unitService);
    }

    @Test
    public void getUnitsTest() {
        assertNotNull(unitService.getUnits());
        assertEquals(5, unitService.getUnits().size());
    }

    @Test
    public void getUnitsBasedOnCategoryIdTest() {
        assertNotNull(unitService.getUnitsBasedOnCategoryId("C001"));
        assertEquals(2, unitService.getUnitsBasedOnCategoryId("C001").size());
    }
}