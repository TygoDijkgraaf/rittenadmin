package com.vitas.rittenadmin.order;

import com.vitas.rittenadmin.exception.BadRequestException;
import com.vitas.rittenadmin.stop.Stop;
import com.vitas.rittenadmin.stop.StopRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final StopRepository stopRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, StopRepository stopRepository) {
        this.orderRepository = orderRepository;
        this.stopRepository = stopRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrder(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new BadRequestException(
                        "Failed to retrieve order: Order with id " + id + " does not exist"
                ));
    }

    public void addNewOrder(Order order) {
        if (orderRepository.existsByOrderNumber(order.getOrderNumber())) {
            throw new BadRequestException(
                    "Failed to add order: Order with order number " + order.getOrderNumber() + " already exists"
            );
        }

        orderRepository.save(order);
    }

    @Transactional
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new BadRequestException("Failed to delete order: Order with id " + id + " does not exist");
        }

        for (Stop stop : stopRepository.findByOrderId(id)) {
            stopRepository.delete(stop);
        }

        orderRepository.deleteById(id);
    }

    @Transactional
    public void updateOrder(Long id, String orderNumber, String description) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new BadRequestException(
                        "Failed to update order: Order with id " + id + " does not exist"
                ));

        if (orderNumber != null && !orderNumber.isEmpty() && !Objects.equals(order.getOrderNumber(), orderNumber)) {
            if (orderRepository.existsByOrderNumber(orderNumber)) {
                throw new BadRequestException(
                        "Failed to update order: Order with order number " + orderNumber + " already exists"
                );
            }

            order.setOrderNumber(orderNumber);
        }

        if (description != null && !description.isEmpty() && !Objects.equals(order.getDescription(), description)) {
            order.setDescription(description);
        }
    }
}
