package com.balmik.spring_security.service.impl;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.balmik.spring_security.dto.AuthRequest;
import com.balmik.spring_security.dto.AuthResponse;
import com.balmik.spring_security.entity.Authority;
import com.balmik.spring_security.entity.User;
import com.balmik.spring_security.enums.AuthorityEnum;
import com.balmik.spring_security.repository.AuthorityRepository;
import com.balmik.spring_security.repository.UserRepository;
import com.balmik.spring_security.security.JwtUtil;
import com.balmik.spring_security.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthorityRepository authorityRepository;

    @Override
    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByUserName(request.getUsername());
        if (user != null && passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            String accessToken = jwtUtil.generateAccessToken(user.getUserName());
            String refreshToken = jwtUtil.generateRefreshToken(user.getUserName());
            return new AuthResponse(accessToken, refreshToken);
        }
        return null; // Consider throwing an exception for invalid credentials
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        String username = jwtUtil.extractUsernameByRefreshToken(refreshToken); // Updated to use refresh-specific method
        if (jwtUtil.validateRefreshToken(refreshToken, username)) { // Updated to use refresh-specific method
            String newAccessToken = jwtUtil.generateAccessToken(username);
            return new AuthResponse(newAccessToken, refreshToken);
        }
        return null; // Consider throwing an exception for invalid refresh token
    }

    @Override
    public User register(User user) {
        // Encode the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Initialize the authorities set if null
        Set<Authority> authorities = user.getAuthority() != null ? user.getAuthority() : new HashSet<>();

        // Assign authorities based on provided roles or default to ROLE_USER
        if (authorities.isEmpty()) {
            // Default to ROLE_USER if no authorities are provided
            Authority userAuthority = authorityRepository.findByAuthority(AuthorityEnum.ROLE_USER);
            if (userAuthority == null) {
                userAuthority = new Authority();
                userAuthority.setAuthority(AuthorityEnum.ROLE_USER); // Ensure this is set before saving
                authorityRepository.save(userAuthority); // Save the new authority
            }
            authorities.add(userAuthority);
        } else {
            // Process provided authorities
            Set<Authority> validatedAuthorities = new HashSet<>();
            for (Authority authority : authorities) {
                AuthorityEnum authorityEnum = authority.getAuthority();
                if (authorityEnum == null) {
                    // If the authority field is null, skip or assign a default (e.g., ROLE_USER)
                    continue;
                }
                Authority existingAuthority = authorityRepository.findByAuthority(authorityEnum);
                if (existingAuthority == null) {
                    existingAuthority = new Authority();
                    existingAuthority.setAuthority(authorityEnum); // Ensure this is set before saving
                    authorityRepository.save(existingAuthority); // Save the new authority
                }
                validatedAuthorities.add(existingAuthority);
            }
            authorities = validatedAuthorities; // Replace with validated set
        }

        // Set the authorities to the user
        user.setAuthority(authorities);

        // Save and return the user
        return userRepository.save(user);
    }
}