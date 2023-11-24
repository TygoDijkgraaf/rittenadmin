package com.vitas.rittenadmin.order;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class OrderRepositoryTest {

    @Autowired
    private OrderRepository orderRepository;

    @AfterEach
    void tearDown() {
        orderRepository.deleteAll();
    }

    @Test
    void orderShouldExist() {
        String orderNumber = "A1B2C3";
        Order order = new Order(
                orderNumber,
                "A description for an order"
        );

        orderRepository.save(order);

        boolean exists = orderRepository.existsByOrderNumber(orderNumber);

        assertThat(exists).isTrue();
    }

    @Test
    void orderShouldNotExist() {
        String orderNumber = "A1B2C3";

        boolean exists = orderRepository.existsByOrderNumber(orderNumber);

        assertThat(exists).isFalse();
    }
}
