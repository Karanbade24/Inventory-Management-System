package com.training.messaging;
public class PurchaseCreatedEvent {
    private Integer purchaseId; private String transactionId; private String vendorName; private Double purchaseAmount; private String eventType = "PURCHASE_CREATED";
    public PurchaseCreatedEvent() {}
    public PurchaseCreatedEvent(Integer id, String tx, String vendor, Double amount) { purchaseId=id; transactionId=tx; vendorName=vendor; purchaseAmount=amount; }
    public Integer getPurchaseId(){return purchaseId;} public String getTransactionId(){return transactionId;} public String getVendorName(){return vendorName;} public Double getPurchaseAmount(){return purchaseAmount;} public String getEventType(){return eventType;}
}
