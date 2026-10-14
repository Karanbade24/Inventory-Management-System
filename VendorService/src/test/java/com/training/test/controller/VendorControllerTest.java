package com.training.test.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.training.business.bean.VendorBean;
import com.training.controller.VendorController;
import com.training.service.VendorService;

@WebMvcTest(VendorController.class)
public class VendorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VendorService vendorServiceMock;

    @Test
    public void indexVendorControllerTest() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/"))
               .andExpect(status().isOk())
               .andExpect(content().string(
                   "Welcome to Spring Boot Vendor Service API!"
               ));
    }

    @Test
    public void getVendorDetailsTest() throws Exception {
        // Arrange
        VendorBean vendor1 = new VendorBean();
        vendor1.setVendorId("101");
        vendor1.setVendorName("Vendor A");

        VendorBean vendor2 = new VendorBean();
        vendor2.setVendorId("102");
        vendor2.setVendorName("Vendor B");

        List<VendorBean> mockVendorList = Arrays.asList(vendor1, vendor2);

        when(vendorServiceMock.getVendorDetails()).thenReturn(mockVendorList);

        // Act & Assert
        mockMvc.perform(MockMvcRequestBuilders.get("/vendor/controller/getVendors")
               .contentType(MediaType.APPLICATION_JSON))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.length()").value(2))
               .andExpect(jsonPath("$[0].vendorId").value("101"))
               .andExpect(jsonPath("$[0].vendorName").value("Vendor A"))
               .andExpect(jsonPath("$[1].vendorId").value("102"))
               .andExpect(jsonPath("$[1].vendorName").value("Vendor B"));
    }
}