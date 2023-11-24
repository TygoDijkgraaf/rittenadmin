package com.vitas.rittenadmin.stop;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/stop")
public class StopController {

    private final StopService stopService;

    @Autowired
    public StopController(StopService stopService) {
        this.stopService = stopService;
    }

    @GetMapping
    public List<StopResponseDTO> getAllStops() {
        return stopService.getAllStops();
    }

    @GetMapping
    @RequestMapping("{id}")
    public StopResponseDTO getStop(@PathVariable Long id) {
        return stopService.getStop(id);
    }

    @PostMapping
    @RequestMapping("new")
    public ResponseEntity<String> addNewStop(@RequestBody StopRequestDTO stopRequest) {
        stopService.addNewStop(stopRequest, false);
        return ResponseEntity.status(HttpStatus.CREATED).body("Stop created successfully");
    }

    @DeleteMapping
    @RequestMapping("delete/{id}")
    public ResponseEntity<String> deleteStop(@PathVariable Long id) {
        stopService.deleteStop(id);
        return ResponseEntity.status(HttpStatus.OK).body("Stop deleted successfully");
    }

    @PutMapping
    @RequestMapping("update/{id}")
    public ResponseEntity<String> updateStop(
            @PathVariable Long id,
            @RequestParam(required = false) String postalCode,
            @RequestParam(required = false) String houseNumber,
            @RequestParam(required = false) Long routeId,
            @RequestParam(required = false) Long orderId) {
        stopService.updateStop(id, postalCode, houseNumber, routeId, orderId);
        return ResponseEntity.status(HttpStatus.OK).body("Stop updated successfully");
    }

    @PutMapping
    @RequestMapping("deliver/{id}")
    public ResponseEntity<String> toggleDeliveryStatus(@PathVariable Long id) {
        stopService.toggleDeliveryStatus(id);
        return ResponseEntity.status(HttpStatus.OK).body("Stop updated successfully");
    }
}
