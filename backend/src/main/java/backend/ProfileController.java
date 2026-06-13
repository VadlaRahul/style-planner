package backend;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @PostMapping("/onboard")
    public ResponseEntity<?> onboard(@RequestBody Map<String, Object> request) {
        try {
            Map<String, Object> response = profileService.saveProfile(
                (String) request.get("email"),
                Double.parseDouble(request.get("heightCm").toString()),
                Double.parseDouble(request.get("weightKg").toString()),
                (String) request.get("bodyType"),
                (String) request.get("preferredStyle"),
                (String) request.get("locationCity")
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getProfile(@RequestParam String email) {
        try {
            Map<String, Object> response = profileService.getProfile(email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}