package com.balmik.spring_security.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.balmik.spring_security.entity.User;
import com.balmik.spring_security.enums.AuthorityEnum;
import com.balmik.spring_security.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    
    @PostMapping("/create")
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PostMapping("/{userName}/assignRole/{roleName}")
    public String assignRoleToUser(@PathVariable String userName, @PathVariable AuthorityEnum roleName) {
        userService.assignRoleToUser(userName, roleName);
        return "Role " + roleName + " assigned to user " + userName;
    }
}

