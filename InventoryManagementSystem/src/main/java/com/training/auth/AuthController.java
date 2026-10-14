package com.training.auth;

import com.training.security.JwtService;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AppUserRepository users; private final PasswordEncoder encoder; private final JwtService jwt;
    public AuthController(AppUserRepository users, PasswordEncoder encoder, JwtService jwt) { this.users=users; this.encoder=encoder; this.jwt=jwt; }
    @PostMapping("/register") public ResponseEntity<?> register(@Valid @RequestBody Credentials c) {
        String username = c.username.trim().toLowerCase();
        if (username.length() < 3) return ResponseEntity.badRequest().body(new Message("Username must contain at least 3 characters."));
        if (users.existsByUsername(username)) return ResponseEntity.status(HttpStatus.CONFLICT).body(new Message("Username already exists."));
        AppUser u = new AppUser(); u.setUsername(username); u.setPasswordHash(encoder.encode(c.password)); u.setRole("USER"); users.save(u);
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(jwt.createToken(u.getUsername(), u.getRole()), u.getUsername()));
    }
    @PostMapping("/login") public ResponseEntity<?> login(@Valid @RequestBody Credentials c) {
        return users.findByUsername(c.username.trim().toLowerCase()).filter(u -> encoder.matches(c.password, u.getPasswordHash()))
            .<ResponseEntity<?>>map(u -> ResponseEntity.ok(new AuthResponse(jwt.createToken(u.getUsername(), u.getRole()), u.getUsername())))
            .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new Message("Invalid username or password.")));
    }
    public static class Credentials {
        @NotBlank @Size(min=3, max=80) public String username;
        @NotBlank @Size(min=8, max=72) public String password;
    }
    public static class AuthResponse { public final String token; public final String username; public AuthResponse(String t,String u){token=t;username=u;} }
    public static class Message { public final String message; public Message(String m){message=m;} }
}
