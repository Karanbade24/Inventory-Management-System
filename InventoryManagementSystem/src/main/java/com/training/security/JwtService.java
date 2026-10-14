package com.training.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private final Key key;
    private final long expirationMs;
    public JwtService(@Value("${ims.jwt.secret}") String secret,
                      @Value("${ims.jwt.expiration-ms:3600000}") long expirationMs) {
        if (secret.getBytes(StandardCharsets.UTF_8).length < 32)
            throw new IllegalArgumentException("IMS_JWT_SECRET must be at least 32 bytes.");
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }
    public String createToken(String username, String role) {
        Date now = new Date();
        return Jwts.builder().setSubject(username).claim("role", role).setIssuedAt(now)
            .setExpiration(new Date(now.getTime() + expirationMs)).signWith(key, SignatureAlgorithm.HS256).compact();
    }
    public String username(String token) { return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject(); }
    public boolean isValid(String token) { try { username(token); return true; } catch (RuntimeException ex) { return false; } }
}
