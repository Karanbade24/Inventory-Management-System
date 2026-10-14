package com.training.test.dao;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.training.business.bean.PurchaseBean;
import com.training.dao.ReportsDAO;
import com.training.dao.ReportsDataAccess;
import com.training.entity.PurchaseEntity;

@ExtendWith(MockitoExtension.class)
public class ReportsDataAccessTest {

    @Mock
    private ReportsDAO reportsDAO;

    @InjectMocks
    private ReportsDataAccess reportsDataAccess;

    @Test
    public void testGetVendorWisePurchaseDetails() {

        Date purchaseDate = new Date();

        PurchaseEntity entity = new PurchaseEntity();

        entity.setPurchaseId(101);
        entity.setTransactionId("P_ONL_01012026_C01");
        entity.setVendorName("Only Vimal");
        entity.setMaterialCategoryId("C001");
        entity.setMaterialTypeId("T001");
        entity.setBrandName("BrandX");
        entity.setUnitId("U001");
        entity.setQuantity(5);
        entity.setPurchaseAmount(500.0);
        entity.setPurchaseDate(purchaseDate);
        entity.setStatus("SUCCESS");

        when(reportsDAO.getVendorWisePurchaseDetails(
                null, null, "Only Vimal"))
                .thenReturn(Arrays.asList(entity));

        List<PurchaseBean> result =
                reportsDataAccess.getVendorWisePurchaseDetails(
                        null, null, "Only Vimal");

        assertNotNull(result);
        assertEquals(1, result.size());

        PurchaseBean bean = result.get(0);

        assertEquals(101, bean.getPurchaseId());
        assertEquals("P_ONL_01012026_C01",
                bean.getTransactionId());
        assertEquals("Only Vimal",
                bean.getVendorName());
        assertEquals("C001",
                bean.getMaterialCategoryId());
        assertEquals("T001",
                bean.getMaterialTypeId());
        assertEquals("BrandX",
                bean.getBrandName());
        assertEquals("U001",
                bean.getUnitId());
        assertEquals(5, bean.getQuantity());
        assertEquals(500.0, bean.getPurchaseAmount());
        assertEquals("SUCCESS", bean.getStatus());
    }
}