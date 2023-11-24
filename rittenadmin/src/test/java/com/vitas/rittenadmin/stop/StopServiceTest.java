package com.vitas.rittenadmin.stop;

import com.vitas.rittenadmin.exception.BadRequestException;
import com.vitas.rittenadmin.order.Order;
import com.vitas.rittenadmin.order.OrderRepository;
import com.vitas.rittenadmin.route.Route;
import com.vitas.rittenadmin.route.RouteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StopServiceTest {

    @Mock
    private StopRepository stopRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private RouteRepository routeRepository;

    @InjectMocks
    private StopService stopService;

    @Test
    void shouldGetAllStops() {
        stopService.getAllStops();

        verify(stopRepository).findAll();
    }

    @Test
    void shouldGetStop() {
        Long stopId = 1L;
        Stop stop = new Stop();
        stop.setId(stopId);

        given(stopRepository.findById(stopId)).willReturn(Optional.of(stop));

        StopResponseDTO result = stopService.getStop(stopId);

        assertThat(result.getId()).isEqualTo(stopId);
    }

    @Test
    void shouldThrowExceptionWhenGettingStopThatDoesNotExist() {
        Long stopId = 1L;

        given(stopRepository.findById(stopId)).willReturn(Optional.empty());

        assertThatThrownBy(() -> stopService.getStop(stopId))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Stop with id " + stopId + " does not exist");
    }

    @Test
    void shouldAddStop() {
        Long orderId = 2L;
        Long routeId = 3L;
        Order order = new Order();
        Route route = new Route();
        order.setId(orderId);
        route.setId(routeId);
        route.setStops(new ArrayList<>());
        Stop stop = new Stop(
                "1234AB",
                "10",
                route,
                order
        );
        StopRequestDTO stopRequest = new StopRequestDTO(stop);

        given(orderRepository.findById(orderId)).willReturn(Optional.of(order));
        given(routeRepository.findById(routeId)).willReturn(Optional.of(route));

        stopService.addNewStop(stopRequest, false);

        ArgumentCaptor<Stop> stopArgumentCaptor = ArgumentCaptor.forClass(Stop.class);
        verify(stopRepository).save(stopArgumentCaptor.capture());
        Stop capturedStop = stopArgumentCaptor.getValue();

        assertThat(capturedStop)
                .extracting(Stop::getPostalCode, Stop::getHouseNumber, Stop::getOrder, Stop::getRoute)
                .containsExactly(stop.getPostalCode(), stop.getHouseNumber(), stop.getOrder(), stop.getRoute());
    }

    @Test
    void shouldThrowExceptionWhenAddingStopWithOrderThatDoesNotExist() {
        Long orderId = 1L;
        Long routeId = 2L;

        StopRequestDTO stopRequest = new StopRequestDTO(
                "1234AB",
                "10",
                routeId,
                orderId
        );

        given(orderRepository.findById(orderId)).willReturn(Optional.empty());

        assertThatThrownBy(() -> stopService.addNewStop(stopRequest, false))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Order with id " + stopRequest.getOrderId() + " does not exist");

        verify(stopRepository, never()).save(any());
    }

    @Test
    void shouldThrowExceptionWhenAddingStopWithRouteThatDoesNotExist() {
        Long orderId = 1L;
        Long routeId = 2L;
        Order order = new Order();

        StopRequestDTO stopRequest = new StopRequestDTO(
                "1234AB",
                "10",
                routeId,
                orderId
        );

        given(orderRepository.findById(orderId)).willReturn(Optional.of(order));
        given(routeRepository.findById(routeId)).willReturn(Optional.empty());

        assertThatThrownBy(() -> stopService.addNewStop(stopRequest, false))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Route with id " + stopRequest.getRouteId() + " does not exist");

        verify(stopRepository, never()).save(any());
    }

    @Test
    void shouldThrowExceptionWhenAddingStopWithRouteThatIsAlreadyFinished() {
        Long orderId = 1L;
        Long routeId = 2L;
        Order order = new Order();
        Route route = mock(Route.class);

        StopRequestDTO stopRequest = new StopRequestDTO(
                "1234AB",
                "10",
                routeId,
                orderId
        );

        given(orderRepository.findById(orderId)).willReturn(Optional.of(order));
        given(routeRepository.findById(routeId)).willReturn(Optional.of(route));
        given(route.getFinished()).willReturn(true);
        given(route.getId()).willReturn(routeId);

        assertThatThrownBy(() -> stopService.addNewStop(stopRequest, false))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Route with id " + stopRequest.getRouteId() + " is already finished");

        verify(stopRepository, never()).save(any());
    }

    @Test
    void shouldDeleteStop() {
        Long stopId = 1L;

        given(stopRepository.existsById(stopId)).willReturn(true);

        stopService.deleteStop(stopId);

        verify(stopRepository).deleteById(stopId);
    }

    @Test
    void shouldThrowExceptionWhenDeletingStopThatDoesNotExist() {
        Long stopId = 1L;

        given(stopRepository.existsById(stopId)).willReturn(false);

        assertThatThrownBy(() -> stopService.deleteStop(stopId))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Stop with id " + stopId + " does not exist");

        verify(stopRepository, never()).deleteById(any());
    }

    @Test
    void shouldUpdateStop() {
        Long stopId = 1L;
        Long routeId = 2L;
        Long orderId = 3L;
        Stop stop = new Stop();
        stop.setPostalCode("1234AB");
        stop.setHouseNumber("10");
        Route route = new Route();
        route.setId(routeId);
        stop.setRoute(route);
        Order order = new Order();
        order.setId(orderId);
        stop.setOrder(order);

        Long newRouteId = 4L;
        Long newOrderId = 5L;
        String newPostalCode = "4567CD";
        String newHouseNumber = "20";
        Route newRoute = new Route();
        newRoute.setStops(new ArrayList<>());
        Order newOrder = new Order();

        given(stopRepository.findById(stopId)).willReturn(Optional.of(stop));
        given(routeRepository.findById(newRouteId)).willReturn(Optional.of(newRoute));
        given(orderRepository.findById(newOrderId)).willReturn(Optional.of(newOrder));

        stopService.updateStop(stopId, newPostalCode, newHouseNumber, newRouteId, newOrderId);

        assertThat(stop).
                extracting(Stop::getPostalCode, Stop::getHouseNumber, Stop::getRoute, Stop::getOrder)
                .containsExactly(newPostalCode, newHouseNumber, newRoute, newOrder);

    }

    @Test
    void shouldThrowExceptionWhenUpdatingStopThatDoesNotExist() {
        Long stopId = 1L;

        Long newRouteId = 4L;
        Long newOrderId = 5L;
        String newPostalCode = "4567CD";
        String newHouseNumber = "20";

        given(stopRepository.findById(stopId)).willReturn(Optional.empty());

        assertThatThrownBy(() -> stopService.updateStop(stopId, newPostalCode, newHouseNumber, newRouteId, newOrderId))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Stop with id " + stopId + " does not exist");

    }

    @Test
    void shouldDeliverStop() {
        Long stopId = 1L;
        Stop stop = new Stop();
        stop.setDelivered(false);

        given(stopRepository.findById(stopId)).willReturn(Optional.of(stop));

        stopService.toggleDeliveryStatus(stopId);

        assertThat(stop.getDelivered()).isTrue();
    }

    @Test
    void shouldThrowExceptionWhenDeliveringStopThatDoesNotExist() {
        Long stopId = 1L;

        given(stopRepository.findById(stopId)).willReturn(Optional.empty());

        assertThatThrownBy(() -> stopService.toggleDeliveryStatus(stopId))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Stop with id " + stopId + " does not exist");
    }
}
