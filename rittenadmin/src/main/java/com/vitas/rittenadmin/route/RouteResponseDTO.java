package com.vitas.rittenadmin.route;

import com.vitas.rittenadmin.stop.StopResponseDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class RouteResponseDTO {
    private Long id;
    private LocalDateTime start;
    private String description;
    private List<StopResponseDTO> stops;
    private Boolean finished;

    public RouteResponseDTO() {
    }

    public RouteResponseDTO(Route route) {
        this.id = route.getId();
        this.start = route.getStart();
        this.description = route.getDescription();
        this.stops = route.getStops().stream().map(StopResponseDTO::new).collect(Collectors.toList());
        this.finished = route.getFinished();
    }

    public LocalDateTime getStart() {
        return start;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public List<StopResponseDTO> getStops() {
        return stops;
    }

    public void setStops(List<StopResponseDTO> stops) {
        this.stops = stops;
    }

    public Boolean getFinished() {
        return finished;
    }

    public void setFinished(Boolean finished) {
        this.finished = finished;
    }
}
