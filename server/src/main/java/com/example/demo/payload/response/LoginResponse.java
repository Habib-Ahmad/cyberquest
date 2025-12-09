package com.example.demo.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private UserInfo user;

    public LoginResponse(String token, UUID id, String username, String email, List<String> roles) {
        this.token = token;
        this.user = new UserInfo(id, username, email, roles);
    }

    @Getter
    @AllArgsConstructor
    public static class UserInfo {
        private UUID id;
        private String username;
        private String email;
        private List<String> roles;
    }
}


