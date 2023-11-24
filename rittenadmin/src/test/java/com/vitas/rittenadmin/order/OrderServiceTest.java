package com.vitas.rittenadmin.order;

import com.vitas.rittenadmin.exception.BadRequestException;
import com.vitas.rittenadmin.stop.Stop;
import com.vitas.rittenadmin.stop.StopRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private StopRepository stopRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    void shouldGetAllOrders() {
        orderService.getAllOrders();

        verify(orderRepository).findAll();
    }

    @Test
    void shouldGetOrder() {
        Long orderId = 1L;
        Order order = new Order(
                "A1B2C3",
                "A description for an order"
        );

        given(orderRepository.findById(orderId)).willReturn(Optional.of(order));

        Order result = orderService.getOrder(orderId);

        assertThat(result).isEqualTo(order);
    }

    @Test
    void shouldThrowExceptionGettingOrderThatDoesNotExist() {
        Long orderId = 1L;

        given(orderRepository.findById(orderId)).willReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getOrder(orderId))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Order with id " + orderId + " does not exist");
    }

    @Test
    void shouldAddOrder() {
        String orderNumber = "A1B2C3";
        Order order = new Order(
                orderNumber,
                "A description for an order"
        );

        given(orderRepository.existsByOrderNumber(orderNumber)).willReturn(false);

        orderService.addNewOrder(order);

        ArgumentCaptor<Order> orderArgumentCaptor = ArgumentCaptor.forClass(Order.class);
        verify(orderRepository).save(orderArgumentCaptor.capture());
        Order capturedOrder = orderArgumentCaptor.getValue();

        assertThat(capturedOrder).isEqualTo(order);
    }

    @Test
    void shouldThrowExceptionWhenAddingOrderThatAlreadyExists() {
        String orderNumber = "A1B2C3";
        Order order = new Order(
                orderNumber,
                "A description for an order"
        );

        given(orderRepository.existsByOrderNumber(orderNumber)).willReturn(true);

        assertThatThrownBy(() -> orderService.addNewOrder(order))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Order with order number " + orderNumber + " already exists");

        verify(orderRepository, never()).save(any());
    }

    @Test
    void shouldDeleteOrderWithStops() {
        Long orderId = 1L;
        List<Stop> stops = List.of(new Stop(), new Stop());

        given(orderRepository.existsById(orderId)).willReturn(true);
        given(stopRepository.findByOrderId(orderId)).willReturn(stops);

        orderService.deleteOrder(orderId);

        ArgumentCaptor<Stop> stopArgumentCaptor = ArgumentCaptor.forClass(Stop.class);
        verify(stopRepository, times(stops.size())).delete(stopArgumentCaptor.capture());
        List<Stop> capturedStops = stopArgumentCaptor.getAllValues();

        assertThat(capturedStops).isEqualTo(stops);

        verify(orderRepository).deleteById(orderId);
    }

    @Test
    void shouldDeleteOrderWithoutStops() {
        Long orderId = 1L;
        List<Stop> stops = new ArrayList<>();

        given(orderRepository.existsById(orderId)).willReturn(true);
        given(stopRepository.findByOrderId(orderId)).willReturn(stops);

        orderService.deleteOrder(orderId);

        verify(stopRepository, never()).delete(any());
        verify(orderRepository).deleteById(orderId);
    }

    @Test
    void shouldThrowExceptionWhenDeletingOrderThatDoesNotExist() {
        Long orderId = 1L;

        given(orderRepository.existsById(orderId)).willReturn(false);

        assertThatThrownBy(() -> orderService.deleteOrder(orderId))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Order with id " + orderId + " does not exist");

        verify(stopRepository, never()).delete(any());
        verify(orderRepository, never()).deleteById(any());
    }

    @Test
    void shouldUpdateOrder() {
        Long orderId = 1L;
        Order order = new Order(
                "OldOrderNumber123",
                "Old Description"
        );
        String newOrderNumber = "NewOrderNumber123";
        String newDescription = "New Description";

        given(orderRepository.findById(orderId)).willReturn(Optional.of(order));
        given(orderRepository.existsByOrderNumber(newOrderNumber)).willReturn(false);

        orderService.updateOrder(orderId, newOrderNumber, newDescription);

        assertThat(order.getOrderNumber()).isEqualTo(newOrderNumber);
        assertThat(order.getDescription()).isEqualTo(newDescription);
    }

    @Test
    void shouldThrowExceptionWhenUpdatingOrderThatDoesNotExist() {
        Long orderId = 1L;
        String newOrderNumber = "NewOrderNumber123";
        String newDescription = "New Description";

        given(orderRepository.findById(orderId)).willReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.updateOrder(orderId, newOrderNumber, newDescription))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Order with id " + orderId + " does not exist");
    }

    @Test
    void shouldThrowExceptionWhenUpdatingOrderNumberThatAlreadyExists() {
        Long orderId = 1L;
        Order order = new Order(
                "OldOrderNumber123",
                "Old Description"
        );
        String newOrderNumber = "NewOrderNumber123";
        String newDescription = "New Description";

        given(orderRepository.findById(orderId)).willReturn(Optional.of(order));
        given(orderRepository.existsByOrderNumber(newOrderNumber)).willReturn(true);

        assertThatThrownBy(() -> orderService.updateOrder(orderId, newOrderNumber, newDescription))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Order with order number " + newOrderNumber + " already exists");

        assertThat(order.getOrderNumber()).isNotEqualTo(newOrderNumber);
        assertThat(order.getDescription()).isNotEqualTo(newDescription);
    }
}
