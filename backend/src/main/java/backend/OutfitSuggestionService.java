package backend;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OutfitSuggestionService {

    @Autowired
    private ClothingItemRepository clothingItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${weather.api.key}")
    private String apiKey;

    public Map<String, Object> suggestOutfit(
            String email, String city, String occasion) {

        // Get user
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found!"));

        // Get weather
        double temp = getTemperature(city);
        String warmthNeeded = getWarmthLevel(temp);

        // Get all user's clothing items
        List<ClothingItem> allItems =
            clothingItemRepository.findByUserId(user.getId());

        // Pick best item for each category
        Map<String, Object> suggestion = new HashMap<>();
        suggestion.put("temperature", temp);
        suggestion.put("warmthNeeded", warmthNeeded);
        suggestion.put("occasion", occasion);

        String[] categories = {"TOP", "BOTTOM", "FOOTWEAR", "OUTERWEAR"};
        for (String cat : categories) {
            ClothingItem best = pickBestItem(allItems, cat,
                warmthNeeded, occasion);
            if (best != null) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("id", best.getId());
                itemMap.put("name", best.getName());
                itemMap.put("brand", best.getBrand());
                itemMap.put("imagePath", best.getOriginalImagePath());
                itemMap.put("warmth", best.getWarmth());
                itemMap.put("occasion", best.getOccasion());
                suggestion.put(cat.toLowerCase(), itemMap);
            } else {
                suggestion.put(cat.toLowerCase(), null);
            }
        }

        return suggestion;
    }

    private ClothingItem pickBestItem(
            List<ClothingItem> items, String category,
            String warmthNeeded, String occasion) {

        List<ClothingItem> categoryItems = new ArrayList<>();
        for (ClothingItem item : items) {
            if (item.getCategory().equalsIgnoreCase(category)) {
                categoryItems.add(item);
            }
        }

        if (categoryItems.isEmpty()) return null;

        // Score each item - higher score = better match
        ClothingItem bestMatch = null;
        int bestScore = -1;

        for (ClothingItem item : categoryItems) {
            int score = 0;

            // Warmth match (most important)
            if (item.getWarmth() != null &&
                item.getWarmth().equalsIgnoreCase(warmthNeeded)) {
                score += 10;
            }

            // Occasion match
            if (item.getOccasion() != null &&
                item.getOccasion().equalsIgnoreCase(occasion)) {
                score += 5;
            }

            if (score > bestScore) {
                bestScore = score;
                bestMatch = item;
            }
        }

        // If nothing matched well, just return first item of category
        if (bestMatch == null) {
            bestMatch = categoryItems.get(0);
        }

        return bestMatch;
    }

    private double getTemperature(String city) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://api.openweathermap.org/data/2.5/weather"
                + "?q=" + city
                + "&appid=" + apiKey
                + "&units=metric";
            Map response = restTemplate.getForObject(url, Map.class);
            Map main = (Map) response.get("main");
            return Double.parseDouble(main.get("temp").toString());
        } catch (Exception e) {
            return 25.0; // default mild temperature
        }
    }

    private String getWarmthLevel(double temp) {
        if (temp >= 28) return "LIGHT";
        if (temp >= 18) return "MEDIUM";
        return "WARM";
    }
}