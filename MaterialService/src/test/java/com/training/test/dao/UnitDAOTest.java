package com.training.test.dao;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.training.dao.UnitDAO;
import com.training.entity.UnitEntity;

@SpringBootTest
@ActiveProfiles("test")
public class UnitDAOTest {

    @Autowired
    private UnitDAO unitDAO;

    @Test
    public void notNullUnitDAOTest() {
        assertNotNull(unitDAO);
    }

    @Test
    public void findByIdUnitTest() {
        UnitEntity entity = unitDAO.findById("U001").orElse(null);
        assertNotNull(entity);
        assertEquals("Metres", entity.getUnitName());
    }

    @Test
    public void findAllUnitTest() {
        assertNotNull(unitDAO.findAll());
        assertEquals(5, unitDAO.findAll().size());
    }

    @Test
    public void findByMaterialCategoryEntityCategoryIdTest() {
        List<UnitEntity> units = unitDAO.findByMaterialCategoryEntityCategoryId("C001");
        assertNotNull(units);
        assertEquals(2, units.size());
    }
}