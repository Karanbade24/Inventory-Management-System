package com.training.test.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.training.service.MaterialTypeService;

@SpringBootTest
@ActiveProfiles("test")
public class MaterialTypeServiceTest {

    @Autowired
    private MaterialTypeService materialTypeService;

    @Test
    public void notNullMaterialTypeServiceTest() {
        assertNotNull(materialTypeService);
    }

    @Test
    public void getMaterialTypesTest() {
        assertNotNull(materialTypeService.getMaterialTypes());
        assertEquals(7, materialTypeService.getMaterialTypes().size());
    }

    @Test
    public void getMaterialTypesBasedOnCategoryIdTest() {
        assertNotNull(materialTypeService.getMaterialTypesBasedOnCategoryId("C001"));
        assertEquals(2, materialTypeService.getMaterialTypesBasedOnCategoryId("C001").size());
    }
}