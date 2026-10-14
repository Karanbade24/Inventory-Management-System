package com.training.messaging;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class PurchaseEventPublisher {
	private static final Logger log = LoggerFactory.getLogger(PurchaseEventPublisher.class);
	private final KafkaTemplate<String, String> kafka;
	private final ObjectMapper mapper;

	public PurchaseEventPublisher(KafkaTemplate<String, String> kafka, ObjectMapper mapper) {
		this.kafka = kafka;
		this.mapper = mapper;
	}

	public void publish(PurchaseCreatedEvent event) {
		try {
			String json = mapper.writeValueAsString(event);
			((Object) kafka.send("ims.purchase.created", String.valueOf(event.getPurchaseId()), json))
					.whenComplete((result, error) -> {
						if (error != null)
							log.error("Could not publish purchase event {}", event.getPurchaseId(), error);
					});
		} catch (JsonProcessingException ex) {
			log.error("Could not serialize purchase event", ex);
		} catch (Exception ex) {
			log.error("Kafka unavailable; purchase saved but event was not published", ex);
		}
	}
}
