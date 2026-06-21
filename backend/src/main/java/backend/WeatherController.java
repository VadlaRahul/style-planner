package backend;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "http://localhost:5173")
public class WeatherController {

    @Value("${weather.api.key}")
    private String apiKey;

    @GetMapping("/current")
    public ResponseEntity<?> getWeather(
        @RequestParam String city
    ) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://api.openweathermap.org/data/2.5/weather"
                + "?q=" + city
                + "&appid=" + apiKey
                + "&units=metric";

            Map response = restTemplate.getForObject(url, Map.class);

            Map<String, Object> result = new HashMap<>();
            Map main = (Map) response.get("main");
            result.put("temp", main.get("temp"));
            result.put("feelsLike", main.get("feels_like"));
            result.put("humidity", main.get("humidity"));

            java.util.List weatherList =
                (java.util.List) response.get("weather");
            Map weather = (Map) weatherList.get(0);
            result.put("condition", weather.get("main"));
            result.put("description", weather.get("description"));
            result.put("icon", weather.get("icon"));
            result.put("city", response.get("name"));

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Could not fetch weather: " + e.getMessage());
        }
    }
}