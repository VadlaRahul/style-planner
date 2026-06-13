package backend;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> saveProfile(
            String email,
            Double heightCm,
            Double weightKg,
            String bodyType,
            String preferredStyle,
            String locationCity) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        UserProfile profile = userProfileRepository
                .findByUserId(user.getId())
                .orElse(new UserProfile());

        profile.setUser(user);
        profile.setHeightCm(heightCm);
        profile.setWeightKg(weightKg);
        profile.setBodyType(bodyType);
        profile.setPreferredStyle(preferredStyle);
        profile.setLocationCity(locationCity);
        profile.setOnboardingDone(true);

        userProfileRepository.save(profile);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Profile saved successfully!");
        response.put("email", email);
        response.put("heightCm", heightCm);
        response.put("weightKg", weightKg);
        response.put("onboardingDone", true);
        return response;
    }

    public Map<String, Object> getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        UserProfile profile = userProfileRepository
                .findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found!"));

        Map<String, Object> response = new HashMap<>();
        response.put("email", email);
        response.put("fullName", user.getFullName());
        response.put("heightCm", profile.getHeightCm());
        response.put("weightKg", profile.getWeightKg());
        response.put("bodyType", profile.getBodyType());
        response.put("preferredStyle", profile.getPreferredStyle());
        response.put("locationCity", profile.getLocationCity());
        response.put("onboardingDone", profile.getOnboardingDone());
        return response;
    }
}
