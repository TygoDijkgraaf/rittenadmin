package com.vitas.rittenadmin.stop;

import com.vitas.rittenadmin.order.Order;
import com.vitas.rittenadmin.order.OrderRepository;
import com.vitas.rittenadmin.route.Route;
import com.vitas.rittenadmin.route.RouteRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class StopRepositoryTest {

    @Autowired
    private StopRepository stopRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RouteRepository routeRepository;

    @AfterEach
    void tearDown() {
        stopRepository.deleteAll();
    }

    @Test
    void shouldFindStopsByOrderId() {
        Order order = new Order(
                "A1B2C3",
                "A description for an order"
        );

        Route route = new Route(
                LocalDateTime.of(2023, Month.NOVEMBER, 9, 14, 46, 0),
                "A description for a route"
        );

        List<Stop> stopsExpected = List.of(
                new Stop(
                        "1234AB",
                        "10",
                        route,
                        order
                ),
                new Stop(
                        "5678CD",
                        "20",
                        route,
                        order
                )
        );

        orderRepository.save(order);
        routeRepository.save(route);
        stopRepository.saveAll(stopsExpected);

        List<Stop> stopsActual = stopRepository.findByOrderId(order.getId());

        assertThat(stopsActual).isEqualTo(stopsExpected);
    }

    @Test
    void shouldNotFindStopsByOrderId() {
        Long orderId = 1L;

        List<Stop> stops = stopRepository.findByOrderId(orderId);

        assertThat(stops).isEmpty();
    }

}
