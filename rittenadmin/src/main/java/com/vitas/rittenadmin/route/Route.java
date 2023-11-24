package com.vitas.rittenadmin.route;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.vitas.rittenadmin.stop.Stop;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "routes")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "route_id")
    private Long id;

    @Column(name = "start")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime start;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "route")
    private List<Stop> stops;

    @Transient
    private Boolean finished;

    public Route() {
    }

    public Route(LocalDateTime start, String description) {
        this.start = start;
        this.description = description;
    }

    public Route(RouteRequestDTO routeRequest) {
        this.start = routeRequest.getStart();
        this.description = routeRequest.getDescription();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public List<Stop> getStops() {
        return stops;
    }

    public void setStops(List<Stop> stops) {
        this.stops = stops;
    }

    public Boolean getFinished() {
        if (stops.isEmpty()) {
            return false;
        }

        return stops.stream().allMatch(Stop::getDelivered);
    }

    public void setFinished(Boolean finished) {
        this.finished = finished;
    }
}
