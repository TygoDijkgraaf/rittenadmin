package com.vitas.rittenadmin.stop;

import com.vitas.rittenadmin.order.Order;

public class StopResponseDTO {
    private Long id;
    private String postalCode;
    private String houseNumber;
    private Boolean delivered;
    private Long routeId;
    private Order order;

    public StopResponseDTO() {
    }

    public StopResponseDTO(Stop stop) {
        this.id = stop.getId();
        this.postalCode = stop.getPostalCode();
        this.houseNumber = stop.getHouseNumber();
        this.delivered = stop.getDelivered();
        this.routeId = stop.getRoute() != null ? stop.getRoute().getId() : null;
        this.order = stop.getOrder();
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

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }
}
