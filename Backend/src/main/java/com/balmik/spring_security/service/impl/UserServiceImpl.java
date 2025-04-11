package com.balmik.spring_security.service.impl;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balmik.spring_security.entity.Authority;
import com.balmik.spring_security.entity.User;
import com.balmik.spring_security.enums.AuthorityEnum;
import com.balmik.spring_security.repository.AuthorityRepository;
import com.balmik.spring_security.repository.UserRepository;
import com.balmik.spring_security.service.UserService;

@Service
public class UserServiceImpl implements UserService{
	
	@Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthorityRepository authorityRepository;

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User getUserByUsername(String userName) {
        return userRepository.findByUserName(userName);
    }

    @Override
    public void assignRoleToUser(String userName, AuthorityEnum roleEnum) {
        User user = userRepository.findByUserName(userName);
        if (user != null) {
            Authority authority = authorityRepository.findByAuthority(roleEnum);
            if (authority != null) {
                Set<Authority> roles = user.getAuthority();
                if (roles == null) {
                    roles = new HashSet<>();
                }
                roles.add(authority);
                user.setAuthority(roles);
                userRepository.save(user);
            }
        }
    }
}
