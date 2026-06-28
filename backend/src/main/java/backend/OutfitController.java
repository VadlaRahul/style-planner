package backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/outfit")
@CrossOrigin(origins = "http://localhost:5173")
public class OutfitController {

    @Autowired
    private OutfitSuggestionService outfitSuggestionService;

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
}