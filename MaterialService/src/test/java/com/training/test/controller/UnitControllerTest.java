package com.training.test.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.training.business.bean.UnitBean;
import com.training.controller.UnitController;
import com.training.service.UnitService;

@WebMvcTest(UnitController.class)
public class UnitControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UnitService unitServiceMock;

    @Test
    public void getUnitDetailsTest() throws Exception {
        List<UnitBean> units = Arrays.asList(
                new UnitBean("U001", "Metres", "C001"),
                new UnitBean("U003", "Yards", "C001"));
        when(unitServiceMock.getUnits()).thenReturn(units);

        mockMvc.perform(MockMvcRequestBuilders.get("/unit/controller/getUnitDetails"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    public void getUnitsByCategoryIdTest() throws Exception {
        List<UnitBean> units = Arrays.asList(
                new UnitBean("U001", "Metres", "C001"),
                new UnitBean("U003", "Yards", "C001"));
        when(unitServiceMock.getUnitsBasedOnCategoryId("C001")).thenReturn(units);

        mockMvc.perform(MockMvcRequestBuilders.get("/unit/controller/getUnitsByCategoryId/C001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].unitName").value("Metres"));
    }
}