package com.balmik.spring_security.service;

import com.balmik.spring_security.dto.AuthRequest;
import com.balmik.spring_security.dto.AuthResponse;
import com.balmik.spring_security.entity.User;

public interface AuthService {
    AuthResponse login(AuthRequest request);
    User register(User user);
    AuthResponse refreshToken(String refreshToken);
}
