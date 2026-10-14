package com.training.test.service;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
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
import com.training.dao.ReportsDataAccess;
import com.training.service.ReportsServiceImpl;

@ExtendWith(MockitoExtension.class)
public class ReportsServiceTest {

    @Mock
    private ReportsDataAccess reportsDataAccess;

    @InjectMocks
    private ReportsServiceImpl reportsService;

    @Test
    public void testGetVendorWisePurchaseDetails() {

        Date fromDate = new Date();
        Date toDate = new Date();
        String vendorName = "Only Vimal";

        PurchaseBean bean = new PurchaseBean();
        bean.setPurchaseId(101);
        bean.setVendorName(vendorName);

        when(reportsDataAccess.getVendorWisePurchaseDetails(
                fromDate, toDate, vendorName))
                .thenReturn(Arrays.asList(bean));

        List<PurchaseBean> result =
                reportsService.getVendorWisePurchaseDetails(
                        fromDate, toDate, vendorName);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Only Vimal", result.get(0).getVendorName());
        assertEquals(101, result.get(0).getPurchaseId());
    }
}