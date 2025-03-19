// src/main/java/dev/kymin/labfood/service/UserService.java
package dev.kymin.labfood.service;

import dev.kymin.labfood.dao.UserDao;
import dev.kymin.labfood.dto.User;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

@Service
public class UserService {
    private final UserDao userDao;

    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }

    public User addUser(User user) {
        try {
            return userDao.addUser(user);
        } catch (SQLException e) {
            throw new RuntimeException("Failed to add user", e);
        }
    }

    public List<User> getAllUsers() {
        try {
            return userDao.getAllUsers();
        } catch (SQLException e) {
            throw new RuntimeException("Failed to fetch users", e);
        }
    }

    public User getUser(Long id) {
        try {
            User user = userDao.getUser(id);
            if (user == null) {
                throw new RuntimeException("User not found with id: " + id);
            }
            return user;
        } catch (SQLException e) {
            throw new RuntimeException("Failed to fetch user", e);
        }
    }

    public void deleteUser(Long id) {
        try {
            boolean deleted = userDao.deleteUser(id);
            if (!deleted) {
                throw new RuntimeException("User not found with id: " + id);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to delete user", e);
        }
    }
}