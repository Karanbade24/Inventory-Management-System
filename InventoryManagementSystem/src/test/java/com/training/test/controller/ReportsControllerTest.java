package com.training.test.controller;

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
import org.springframework.http.ResponseEntity;

import com.training.business.bean.PurchaseBean;
import com.training.business.bean.VendorWisePurchaseReportBean;
import com.training.service.ReportsService;
import com.training.web.client.MaterialCategoryConsumer;
import com.training.web.client.MaterialTypeConsumer;
import com.training.web.client.UnitServiceConsumer;
import com.training.web.client.VendorServiceConsumer;
import com.training.web.controller.ReportsController;

@ExtendWith(MockitoExtension.class)
public class ReportsControllerTest {

    @Mock
    private ReportsService reportsService;

    @Mock
    private MaterialCategoryConsumer materialCategoryConsumer;

    @Mock
    private UnitServiceConsumer unitServiceConsumer;

    @Mock
    private MaterialTypeConsumer materialTypeConsumer;

    @Mock
    private VendorServiceConsumer vendorServiceConsumer;

    @InjectMocks
    private ReportsController reportsController;

    @Test
    public void testGetPurchaseDetails() throws Exception {

        Date fromDate = new Date();
        Date toDate = new Date();

        VendorWisePurchaseReportBean reportBean =
                new VendorWisePurchaseReportBean();

        reportBean.setFromDate(fromDate);
        reportBean.setToDate(toDate);
        reportBean.setVendorName("Only Vimal");

        PurchaseBean purchaseBean = new PurchaseBean();
        purchaseBean.setPurchaseId(101);
        purchaseBean.setVendorName("Only Vimal");

        List<PurchaseBean> purchaseList =
                Arrays.asList(purchaseBean);

        when(reportsService.getVendorWisePurchaseDetails(
                fromDate,
                toDate,
                "Only Vimal"))
                .thenReturn(purchaseList);

        ResponseEntity<List<PurchaseBean>> response =
                reportsController.getPurchaseDetails(reportBean);

        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Only Vimal",
                response.getBody().get(0).getVendorName());
    }
}