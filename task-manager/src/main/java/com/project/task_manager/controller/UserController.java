package com.project.task_manager.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.task_manager.dto.AuthRequest;
import com.project.task_manager.entity.User;
import com.project.task_manager.repository.UserRepository;
import com.project.task_manager.security.JwtUtil;
import com.project.task_manager.service.CustomUserDetails;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

	private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    
	@Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authManager;
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/details")
    public String getData()
    {
    	return "data fetched";
    }
    @GetMapping("/data")
    public List<User> getUsers()
    {
    	List<User> allUsers = userRepository.findAll();
    	return allUsers;
    }
//    @PostMapping("/add")
//    public ResponseEntity<String> testEndpoint() {
//        return ResponseEntity.ok("Endpoint is working");
//    }
    @PostMapping("/add-user")
    public ResponseEntity<String> addUser(@RequestBody User user) {
        logger.info("Received request to add user: {}", user);
        userRepository.save(user);
        return ResponseEntity.ok("User added successfully!");
    }

    @PostMapping("/check-email")
    public Map<String, Boolean> checkEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        User user = userRepository.findByEmail(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", user != null);
        return response;
    }
//
    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        User existingUser = userRepository.findByEmail(request.getUsername());
        if (existingUser != null) {
            return ResponseEntity
                .badRequest()
                .body(Collections.singletonMap("error", "Email already registered"));
        }
        User user = new User();
        user.setEmail(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(Collections.singletonMap("message", "User registered"));
    }

    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        UserDetails userDetails = new CustomUserDetails(userRepository.findByEmail(request.getUsername()));
        String token = jwtUtil.generateToken(userDetails);
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }


}

