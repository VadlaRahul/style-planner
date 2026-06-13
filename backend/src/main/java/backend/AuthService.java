package backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public Map<String, Object> signup(String email, String password, String fullName) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists!");
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setFullName(fullName);
        userRepository.save(user);

        String token = jwtUtil.generateToken(email);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("email", email);
        response.put("fullName", fullName);
        return response;
    }

    public Map<String, Object> login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid password!");
        }

        String token = jwtUtil.generateToken(email);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("email", email);
        response.put("fullName", user.getFullName());
        return response;
    }
}
