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

import com.training.business.bean.MaterialTypeBean;
import com.training.controller.MaterialTypeContoller;
import com.training.service.MaterialTypeService;

@WebMvcTest(MaterialTypeContoller.class)
public class MaterialTypeContollerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MaterialTypeService materialTypeServiceMock;

    @Test
    public void getTypeDetailsTest() throws Exception {
        List<MaterialTypeBean> types = Arrays.asList(
                new MaterialTypeBean("T001", "Silk", "C001"),
                new MaterialTypeBean("T003", "Linen", "C001"));
        when(materialTypeServiceMock.getMaterialTypes()).thenReturn(types);

        mockMvc.perform(MockMvcRequestBuilders.get("/type/controller/getTypeDetails"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    public void getTypesBasedOnCategoryIdTest() throws Exception {
        List<MaterialTypeBean> types = Arrays.asList(
                new MaterialTypeBean("T001", "Silk", "C001"),
                new MaterialTypeBean("T003", "Linen", "C001"));
        when(materialTypeServiceMock.getMaterialTypesBasedOnCategoryId("C001")).thenReturn(types);

        mockMvc.perform(MockMvcRequestBuilders.get("/type/controller/getTypeDetailsByCategoryId/C001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].typeName").value("Silk"));
    }
}