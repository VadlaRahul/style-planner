package backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class ClothingService {

    @Autowired
    private ClothingItemRepository clothingItemRepository;

    @Autowired
    private UserRepository userRepository;

    private final String UPLOAD_DIR = "uploads/clothing/";

    public Map<String, Object> uploadClothing(
            String email,
            String name,
            String category,
            String brand,
            String warmth,
            String occasion,
            MultipartFile image) throws Exception {

        User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                new RuntimeException("User not found!"));

        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) uploadDir.mkdirs();

        String fileName = System.currentTimeMillis() +
            "_" + image.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR + fileName);
        Files.write(filePath, image.getBytes());

        ClothingItem item = new ClothingItem();
        item.setUser(user);
        item.setName(name);
        item.setCategory(category);
        item.setBrand(brand);
        item.setWarmth(warmth);
        item.setOccasion(occasion);
        item.setOriginalImagePath(UPLOAD_DIR + fileName);
        clothingItemRepository.save(item);

        Map<String, Object> response = new HashMap<>();
        response.put("id", item.getId());
        response.put("name", name);
        response.put("category", category);
        response.put("brand", brand);
        response.put("warmth", warmth);
        response.put("occasion", occasion);
        response.put("imagePath", UPLOAD_DIR + fileName);
        response.put("message", "Uploaded successfully!");
        return response;
    }

    public List<Map<String, Object>> getClothingItems(
            String email, String category) {

        User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                new RuntimeException("User not found!"));

        List<ClothingItem> items;
        if (category != null && !category.isEmpty()) {
            items = clothingItemRepository
                .findByUserIdAndCategory(user.getId(), category);
        } else {
            items = clothingItemRepository
                .findByUserId(user.getId());
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (ClothingItem item : items) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", item.getId());
            map.put("name", item.getName());
            map.put("category", item.getCategory());
            map.put("brand", item.getBrand());
            map.put("warmth", item.getWarmth());
            map.put("occasion", item.getOccasion());
            map.put("imagePath", item.getOriginalImagePath());
            result.add(map);
        }
        return result;
    }

    public void deleteClothingItem(Long id) {
        clothingItemRepository.deleteById(id);
    }
} 