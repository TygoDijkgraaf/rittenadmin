package com.vitas.rittenadmin.route;

import com.vitas.rittenadmin.stop.StopRequestDTO;

import java.time.LocalDateTime;
import java.util.List;

public class RouteRequestDTO {
    private LocalDateTime start;
    private String description;
    private List<StopRequestDTO> stops;

    public RouteRequestDTO() {
    }

    public LocalDateTime getStart() {
        return start;
    }

    public void setStart(LocalDateTime start) {
        this.start = start;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<StopRequestDTO> getStops() {
        return stops;
    }

    public void setStops(List<StopRequestDTO> stops) {
        this.stops = stops;
    }
}
