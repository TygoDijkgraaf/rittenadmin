package com.vitas.rittenadmin.route;

import com.vitas.rittenadmin.exception.BadRequestException;
import com.vitas.rittenadmin.stop.Stop;
import com.vitas.rittenadmin.stop.StopRequestDTO;
import com.vitas.rittenadmin.stop.StopResponseDTO;
import com.vitas.rittenadmin.stop.StopService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class RouteService {

    private final RouteRepository routeRepository;
    private final StopService stopService;

    @Autowired
    public RouteService(RouteRepository routeRepository, StopService stopService) {
        this.routeRepository = routeRepository;
        this.stopService = stopService;
    }

    public List<RouteResponseDTO> getAllRoutes() {
        List<Route> routes = routeRepository.findAll();
        return routes.stream().map(RouteResponseDTO::new).collect(Collectors.toList());
    }

    public RouteResponseDTO getRoute(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new BadRequestException(
                        "Failed to retrieve route: Route with id " + id + " does not exist"
                ));

        return new RouteResponseDTO(route);
    }

    public void addNewRoute(RouteRequestDTO routeRequest) {
        Route route = new Route(routeRequest);

        routeRepository.save(route);

        addStopsToRoute(route.getId(), routeRequest.getStops());
    }

    private void addStopsToRoute(Long routeId, List<StopRequestDTO> stopRequests) {
        for (StopRequestDTO stopRequest : stopRequests) {
            stopRequest.setRouteId(routeId);
            stopService.addNewStop(stopRequest, true);
        }
    }

    @Transactional
    public void deleteRoute(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new BadRequestException(
                        "Failed to delete route: Route with id " + id + " does not exist"
                ));

        for (Stop stop : route.getStops()) {
            stopService.deleteStop(stop.getId());
        }

        routeRepository.deleteById(id);
    }

    @Transactional
    public void updateRoute(Long id, LocalDateTime start, String description) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new BadRequestException(
                        "Failed to update route: Route with id " + id + " does not exist"
                ));

        if (start != null && !Objects.equals(route.getStart(), start)) {
            route.setStart(start);
        }

        if (description != null && !description.isEmpty() && !Objects.equals(route.getDescription(), description)) {
            route.setDescription(description);
        }
    }
}
