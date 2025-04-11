package com.balmik.spring_security.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	@Value("${jwt.secret-key}")
    private String SECRET_KEY;

    @Value("${jwt.refresh-secret-key}")
    private String REFRESH_SECRET_KEY;
    
	private final long ACCESS_EXPIRATION = 900000; // 15 mins
	private final long REFRESH_EXPIRATION = 604800000; // 7 days

	// Generate or retrieve the secret key
	private SecretKey getSigningKey() {
		return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
	}
	
	// Generate or retrieve the secret key
		private SecretKey getSigningKeyForRefreshToken() {
			return Keys.hmacShaKeyFor(REFRESH_SECRET_KEY.getBytes(StandardCharsets.UTF_8));
		}

	/**
	 * Generates a JWT token for the given username.
	 */
	public String generateToken(String username) {
		return Jwts.builder()
				.subject(username)           // Non-deprecated method
				.issuedAt(new Date())        // Non-deprecated method
				.expiration(new Date(System.currentTimeMillis() + ACCESS_EXPIRATION)) // Non-deprecated method
				.signWith(getSigningKey())   // Non-deprecated, infers HS256 from key
				.compact();
	}
	public String generateAccessToken(String username) {
		return Jwts.builder()
				.subject(username)
				.issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis() + ACCESS_EXPIRATION))
				.signWith(getSigningKey(SECRET_KEY))
				.compact();
	}

	public String generateRefreshToken(String username) {
		return Jwts.builder()
				.subject(username)
				.issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION))
				.signWith(getSigningKey(REFRESH_SECRET_KEY))
				.compact();
	}

	private Key getSigningKey(String key) {
		return Keys.hmacShaKeyFor(key.getBytes(StandardCharsets.UTF_8));
	}
	/**
	 * Extracts the username from the JWT token.
	 */
	public String extractUsername(String token) {
		Claims claims = parseClaimsFromToken(token);
		return claims.getSubject();
	}
	
	/**
	 * Extracts the username from the JWT token.
	 */
	public String extractUsernameByRefreshToken(String refToken) {
		Claims claims = parseClaimsFromRefreshToken(refToken);
		return claims.getSubject();
	}

	/**
	 * Validates the token by checking its signature and expiration.
	 */
	public boolean validateToken(String token, String username) {
		try {
			String extractedUsername = extractUsername(token);
			return extractedUsername.equals(username) && !isTokenExpired(token);
		} catch (JwtException e) {
			return false; // Invalid signature, malformed token, etc.
		}
	}
	
	/**
	 * Validates the token by checking its signature and expiration.
	 */
	public boolean validateRefreshToken(String refToken, String username) {
		try {
			String extractedUsername = extractUsernameByRefreshToken(refToken);
			return extractedUsername.equals(username) && !isRefreshTokenExpired(refToken);
		} catch (JwtException e) {
			return false; // Invalid signature, malformed token, etc.
		}
	}

	/**
	 * Checks if the token has expired.
	 */
	private boolean isTokenExpired(String token) {
		Claims claims = parseClaimsFromToken(token);
		return claims.getExpiration().before(new Date());
	}
	
	private boolean isRefreshTokenExpired(String refToken) {
		Claims claims = parseClaimsFromRefreshToken(refToken);
		return claims.getExpiration().before(new Date());
	}

	/**
	 * Parses the claims from the token.
	 */
	private Claims parseClaimsFromToken(String token) {
		return Jwts.parser()
				.verifyWith(getSigningKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}
	
	private Claims parseClaimsFromRefreshToken(String refToken) {
		return Jwts.parser()
				.verifyWith(getSigningKeyForRefreshToken())
				.build()
				.parseSignedClaims(refToken)
				.getPayload();
	}

}