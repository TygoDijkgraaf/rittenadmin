package com.vitas.rittenadmin.stop;

import com.vitas.rittenadmin.exception.BadRequestException;
import com.vitas.rittenadmin.order.Order;
import com.vitas.rittenadmin.order.OrderRepository;
import com.vitas.rittenadmin.route.Route;
import com.vitas.rittenadmin.route.RouteRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class StopService {

    private final StopRepository stopRepository;
    private final OrderRepository orderRepository;
    private final RouteRepository routeRepository;

    @Autowired
    public StopService(
            StopRepository stopRepository,
            OrderRepository orderRepository,
            RouteRepository routeRepository) {
        this.stopRepository = stopRepository;
        this.orderRepository = orderRepository;
        this.routeRepository = routeRepository;
    }

    public List<StopResponseDTO> getAllStops() {
        List<Stop> stops = stopRepository.findAll();
        return stops.stream().map(StopResponseDTO::new).collect(Collectors.toList());
    }

    public StopResponseDTO getStop(Long id) {
        Stop stop = stopRepository.findById(id)
                .orElseThrow(() -> new BadRequestException(
                        "Failed to retrieve stop: Stop with id " + id + " does not exist"
                ));

        return new StopResponseDTO(stop);
    }

    public void addNewStop(StopRequestDTO stopRequest, boolean newRoute) {
        Order order = orderRepository.findById(stopRequest.getOrderId())
                .orElseThrow(() -> new BadRequestException(
                        "Failed to add stop: Order with id " + stopRequest.getOrderId() + " does not exist"
                ));

        Route route = routeRepository.findById(stopRequest.getRouteId())
                .orElseThrow(() -> new BadRequestException(
                        "Failed to add stop: Route with id " + stopRequest.getRouteId() + " does not exist"
                ));

        if (!newRoute && route.getFinished()) {
            throw new BadRequestException(
                    "Failed to add stop: Route with id " + route.getId() + " is already finished"
            );
        }

        Stop stop = new Stop(stopRequest, route, order);

        stopRepository.save(stop);
    }

    public void deleteStop(Long id) {
        if (!stopRepository.existsById(id)) {
            throw new BadRequestException("Failed to delete stop: Stop with id " + id + " does not exist");
        }

        stopRepository.deleteById(id);
    }

    @Transactional
    public void updateStop(
            Long id,
            String postalCode,
            String houseNumber,
            Long routeId,
            Long orderId) {
        Stop stop = stopRepository.findById(id)
                .orElseThrow(() -> new BadRequestException(
                        "Failed to update stop: Stop with id " + id + " does not exist"
                ));

        if (postalCode != null && !postalCode.isEmpty() && !Objects.equals(stop.getPostalCode(), postalCode)) {
            stop.setPostalCode(postalCode);
        }

        if (houseNumber != null && !houseNumber.isEmpty() && !Objects.equals(stop.getHouseNumber(), houseNumber)) {
            stop.setHouseNumber(houseNumber);
        }

        if (routeId != null && !Objects.equals(stop.getRoute().getId(), routeId)) {
            Route route = routeRepository.findById(routeId)
                    .orElseThrow(() -> new BadRequestException(
                            "Failed to update stop: Route with id " + routeId + " does not exist"
                    ));

            if (route.getFinished()) {
                throw new BadRequestException(
                        "Failed to update stop: Route with id " + routeId + " is already finsished"
                );
            }

            stop.setRoute(route);
        }

        if (orderId != null && !Objects.equals(stop.getOrder().getId(), orderId)) {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new BadRequestException(
                            "Failed to update stop: Order with id " + orderId + " does not exist"
                    ));

            stop.setOrder(order);
        }
    }

    @Transactional
    public void toggleDeliveryStatus(Long id) {
        Stop stop = stopRepository.findById(id)
                .orElseThrow(() -> new BadRequestException(
                        "Failed to update stop: Stop with id " + id + " does not exist"
                ));

        stop.setDelivered(!stop.getDelivered());
    }
}
