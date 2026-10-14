package com.training.test.dao;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.training.dao.MaterialTypeDAO;
import com.training.entity.MaterialTypeEntity;

@SpringBootTest
@ActiveProfiles("test")
public class MaterialTypeDAOTest {

    @Autowired
    private MaterialTypeDAO materialTypeDAO;

    @Test
    public void notNullMaterialTypeDAOTest() {
        assertNotNull(materialTypeDAO);
    }

    @Test
    public void findByIdMaterialTypeTest() {
        MaterialTypeEntity entity = materialTypeDAO.findById("T001").orElse(null);
        assertNotNull(entity);
        assertEquals("Silk", entity.getTypeName());
    }

    @Test
    public void findAllMaterialTypeTest() {
        assertNotNull(materialTypeDAO.findAll());
        assertEquals(7, materialTypeDAO.findAll().size());
    }

    @Test
    public void findByMaterialCategoryEntityCategoryIdTest() {
        List<MaterialTypeEntity> types = materialTypeDAO.findByMaterialCategoryEntityCategoryId("C001");
        assertNotNull(types);
        assertEquals(2, types.size());
    }
}