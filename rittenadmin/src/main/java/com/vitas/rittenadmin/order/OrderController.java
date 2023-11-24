package com.vitas.rittenadmin.order;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/order")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping
    @RequestMapping("{id}")
    public Order getOrder(@PathVariable Long id) {
        return orderService.getOrder(id);
    }

    @PostMapping
    @RequestMapping("new")
    public ResponseEntity<String> addNewOrder(@RequestBody Order order) {
        orderService.addNewOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED).body("Order created successfully");
    }

    @DeleteMapping
    @RequestMapping("delete/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.status(HttpStatus.OK).body("Order deleted successfully");
    }

    @PutMapping
    @RequestMapping("update/{id}")
    public ResponseEntity<String> updateOrder(
            @PathVariable Long id,
            @RequestParam(required = false) String orderNumber,
            @RequestParam(required = false) String description) {
        orderService.updateOrder(id, orderNumber, description);
        return ResponseEntity.status(HttpStatus.OK).body("Order updated successfully");
    }
}
