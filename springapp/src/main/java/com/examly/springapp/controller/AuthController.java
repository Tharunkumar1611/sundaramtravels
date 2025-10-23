package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.service.JwtUserDetailsService;
import com.examly.springapp.service.UserService;
import com.examly.springapp.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.addUser(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) throws Exception {
        try {
            // Load user details by email
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

            // Fetch the full user entity from DB to get username and role
            User userEntity = userService.getUserByEmail(user.getEmail());

            // Verify password
            if (!passwordEncoder.matches(user.getPassword(), userDetails.getPassword())) {
                throw new BadCredentialsException("Incorrect email or password");
            }

            // Authenticate credentials
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));

            // Update last login time
            userService.updateLastLogin(userEntity.getId());

            // ✅ Generate token with both email & username
            return jwtUtil.generateToken(userEntity.getEmail(), userEntity.getUsername());

        } catch (BadCredentialsException e) {
            throw new Exception("Incorrect email or password", e);
        }
    }
}
