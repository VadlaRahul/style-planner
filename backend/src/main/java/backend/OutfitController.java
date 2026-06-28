package backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/outfit")
@CrossOrigin(origins = "http://localhost:5173")
public class OutfitController {

    @Autowired
    private OutfitSuggestionService outfitSuggestionService;

    @Autowired
    private OutfitSaveService outfitSaveService;

    @GetMapping("/suggest")
    public ResponseEntity<?> suggest(
        @RequestParam String email,
        @RequestParam String city,
        @RequestParam(defaultValue = "CASUAL") String occasion
    ) {
        try {
            Map<String, Object> result =
                outfitSuggestionService.suggestOutfit(email, city, occasion);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(
        @RequestBody Map<String, Object> request
    ) {
        try {
            Map<String, Object> result =
                outfitSaveService.saveOutfit(request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> list(@RequestParam String email) {
        try {
            List<Map<String, Object>> result =
                outfitSaveService.getSavedOutfits(email);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            outfitSaveService.deleteOutfit(id);
            return ResponseEntity.ok("Deleted!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}