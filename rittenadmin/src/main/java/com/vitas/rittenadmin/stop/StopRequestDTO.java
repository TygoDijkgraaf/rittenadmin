package com.vitas.rittenadmin.stop;

public class StopRequestDTO {
    private String postalCode;
    private String houseNumber;
    private Long routeId;
    private Long orderId;

    public StopRequestDTO() {
    }

    public StopRequestDTO(String postalCode, String houseNumber, Long routeId, Long orderId) {
        this.postalCode = postalCode;
        this.houseNumber = houseNumber;
        this.routeId = routeId;
        this.orderId = orderId;
    }

    public StopRequestDTO(Stop stop) {
        this.postalCode = stop.getPostalCode();
        this.houseNumber = stop.getHouseNumber();
        this.routeId = stop.getRoute().getId();
        this.orderId = stop.getOrder().getId();
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

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
}
