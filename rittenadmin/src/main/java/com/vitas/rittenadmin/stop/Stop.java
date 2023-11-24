package com.vitas.rittenadmin.stop;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.vitas.rittenadmin.order.Order;
import com.vitas.rittenadmin.route.Route;
import jakarta.persistence.*;

@Entity
@Table(name = "stops")
public class Stop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stop_id")
    private Long id;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "house_number")
    private String houseNumber;

    @Column(name = "delivered")
    private Boolean delivered;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    public Stop() {
    }

    public Stop(String postalCode, String houseNumber, Route route, Order order) {
        this.postalCode = postalCode;
        this.houseNumber = houseNumber;
        this.delivered = false;
        this.route = route;
        this.order = order;
    }

    public Stop(StopRequestDTO stopRequest, Route route, Order order) {
        this.postalCode = stopRequest.getPostalCode();
        this.houseNumber = stopRequest.getHouseNumber();
        this.delivered = false;
        this.route = route;
        this.order = order;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getHouseNumber() {
        return houseNumber;
    }

    public void setHouseNumber(String houseNumber) {
        this.houseNumber = houseNumber;
    }

    public Boolean getDelivered() {
        return delivered;
    }

    public void setDelivered(Boolean delivered) {
        this.delivered = delivered;
    }

    public Route getRoute() {
        return route;
    }

    public void setRoute(Route route) {
        this.route = route;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }
}
