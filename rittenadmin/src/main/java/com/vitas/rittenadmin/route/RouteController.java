package com.vitas.rittenadmin.route;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("api/route")
public class RouteController {

    private final RouteService routeService;

    @Autowired
    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping
    public List<RouteResponseDTO> getAllRoutes() {
        return routeService.getAllRoutes();
    }

    @GetMapping
    @RequestMapping("{id}")
    public RouteResponseDTO getRoute(@PathVariable Long id) {
        return routeService.getRoute(id);
    }

    @PostMapping
    @RequestMapping("new")
    public ResponseEntity<String> addNewRoute(@RequestBody RouteRequestDTO routeRequest) {
        routeService.addNewRoute(routeRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("Route created successfully");
    }

    @DeleteMapping
    @RequestMapping("delete/{id}")
    public ResponseEntity<String> deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
        return ResponseEntity.status(HttpStatus.OK).body("Route deleted successfully");
    }

    @PutMapping
    @RequestMapping("update/{id}")
    public ResponseEntity<String> updateRoute(
            @PathVariable Long id,
            @RequestParam(required = false) LocalDateTime start,
            @RequestParam(required = false) String description) {
        routeService.updateRoute(id, start, description);
        return ResponseEntity.status(HttpStatus.OK).body("Route updated successfully");
    }
}
