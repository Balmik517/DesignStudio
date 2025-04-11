package com.balmik.spring_security.service;

import com.balmik.spring_security.entity.Authority;
import com.balmik.spring_security.enums.AuthorityEnum;

import java.util.List;

public interface AuthorityService {

    Authority saveAuthority(Authority authority); // Save a new role
    Authority getAuthorityByName(AuthorityEnum authorityName); // Fetch role by name
    List<Authority> getAllAuthorities(); // Get all roles
}
