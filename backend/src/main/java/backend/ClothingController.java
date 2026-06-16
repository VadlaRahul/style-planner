package backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clothing")
@CrossOrigin(origins = "http://localhost:5173")
public class ClothingController {

    @Autowired
    private ClothingService clothingService;

    @PostMapping("/upload")
    public ResponseEntity<?> upload(
        @RequestParam("email") String email,
        @RequestParam("name") String name,
        @RequestParam("category") String category,
        @RequestParam(value = "brand", required = false) String brand,
        @RequestParam("image") MultipartFile image
    ) {
        try {
            Map<String, Object> response = clothingService.uploadClothing(
                email, name, category, brand, image
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> list(
        @RequestParam String email,
        @RequestParam(required = false) String category
    ) {
        try {
            List<Map<String, Object>> items =
                clothingService.getClothingItems(email, category);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            clothingService.deleteClothingItem(id);
            return ResponseEntity.ok("Deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}