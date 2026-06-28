package backend;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OutfitSaveService {

    @Autowired
    private OutfitRepository outfitRepository;

    @Autowired
    private OutfitItemRepository outfitItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClothingItemRepository clothingItemRepository;

    public Map<String, Object> saveOutfit(Map<String, Object> request) {
        String email = (String) request.get("email");
        String name = (String) request.get("name");
        String occasion = (String) request.get("occasion");
        Double temperature = request.get("temperature") != null
            ? Double.parseDouble(request.get("temperature").toString())
            : null;

        @SuppressWarnings("unchecked")
        Map<String, Object> items =
            (Map<String, Object>) request.get("items");

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found!"));

        Outfit outfit = new Outfit();
        outfit.setUser(user);
        outfit.setName(name);
        outfit.setOccasion(occasion);
        outfit.setTemperature(temperature);
        outfitRepository.save(outfit);

        for (String category : items.keySet()) {
            Object itemIdObj = items.get(category);
            if (itemIdObj == null) continue;

            Long itemId = Long.parseLong(itemIdObj.toString());
            ClothingItem clothingItem = clothingItemRepository
                .findById(itemId).orElse(null);
            if (clothingItem == null) continue;

            OutfitItem outfitItem = new OutfitItem();
            outfitItem.setOutfit(outfit);
            outfitItem.setClothingItem(clothingItem);
            outfitItem.setCategory(category.toUpperCase());
            outfitItemRepository.save(outfitItem);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", outfit.getId());
        response.put("name", name);
        response.put("message", "Outfit saved successfully!");
        return response;
    }

    public List<Map<String, Object>> getSavedOutfits(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found!"));

        List<Outfit> outfits = outfitRepository
            .findByUserIdOrderByCreatedAtDesc(user.getId());

        List<Map<String, Object>> result = new ArrayList<>();
        for (Outfit outfit : outfits) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", outfit.getId());
            map.put("name", outfit.getName());
            map.put("occasion", outfit.getOccasion());
            map.put("temperature", outfit.getTemperature());
            map.put("createdAt", outfit.getCreatedAt());

            List<OutfitItem> outfitItems = outfitItemRepository
                .findByOutfitId(outfit.getId());

            List<Map<String, Object>> itemsList = new ArrayList<>();
            for (OutfitItem oi : outfitItems) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("category", oi.getCategory());
                itemMap.put("name", oi.getClothingItem().getName());
                itemMap.put("imagePath",
                    oi.getClothingItem().getOriginalImagePath());
                itemsList.add(itemMap);
            }
            map.put("items", itemsList);
            result.add(map);
        }
        return result;
    }

    public void deleteOutfit(Long id) {
        outfitRepository.deleteById(id);
    }
}