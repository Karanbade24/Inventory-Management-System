package com.training.messaging;
import org.slf4j.Logger; import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
@Component
public class PurchaseEventConsumer {
    private static final Logger log=LoggerFactory.getLogger(PurchaseEventConsumer.class);
    @KafkaListener(topics = "ims.purchase.created", groupId = "ims-reporting")
    public void onPurchaseCreated(String eventJson) {
        // Starter consumer: replace this log with reporting/notification work as the project grows.
        log.info("Consumed purchase-created event: {}", eventJson);
    }
}
