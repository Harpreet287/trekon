package com.trekon.trekon.service;

import com.trekon.trekon.model.User;
import com.trekon.trekon.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@RequiredArgsConstructor

public class UserService {
    private final UserRepository userRepository;

    public User register(User user){
        if(userRepository.findByEmail(user.getEmail()).isPresent()){
            throw new RuntimeException("User already exists");
        }
        return userRepository.save(user);
    }

    public Optional<User> login(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password));
    }
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

}
