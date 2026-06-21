package backend;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
        @RequestParam(value = "brand", required = false)
            String brand,
        @RequestParam(value = "warmth", defaultValue = "MEDIUM")
            String warmth,
        @RequestParam(value = "occasion", defaultValue = "CASUAL")
            String occasion,
        @RequestParam("image") MultipartFile image
    ) {
        try {
            Map<String, Object> response =
                clothingService.uploadClothing(
                    email, name, category, brand,
                    warmth, occasion, image
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
            return ResponseEntity.ok("Deleted!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}