package com.balmik.spring_security.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.balmik.spring_security.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	User findByUserName(String username);
}
