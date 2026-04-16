package com.elmn.SecurityLastChance.service;

import com.elmn.SecurityLastChance.dto.category.CategoryResponse;
import com.elmn.SecurityLastChance.dto.category.CreateCategoryRequest;
import com.elmn.SecurityLastChance.dto.category.UpdateCategoryRequest;
import com.elmn.SecurityLastChance.exception.BadRequestException;
import com.elmn.SecurityLastChance.exception.ConflictException;
import com.elmn.SecurityLastChance.exception.NotFoundException;
import com.elmn.SecurityLastChance.exception.UnauthorizedException;
import com.elmn.SecurityLastChance.model.Category;
import com.elmn.SecurityLastChance.model.User;
import com.elmn.SecurityLastChance.repository.CategoryRepository;
import com.elmn.SecurityLastChance.repository.SessionRepository;
import com.elmn.SecurityLastChance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private static final Pattern HEX_COLOR_PATTERN = Pattern.compile("^#([A-Fa-f0-9]{6})$");

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;

    public List<CategoryResponse> getUserCategories() {
        Long userId = getCurrentUser().getId();

        return categoryRepository.findAllByUserIdOrderByNameAsc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoryResponse getCategoryById(Long categoryId) {
        Category category = getCategoryForCurrentUser(categoryId);
        return toResponse(category);
    }

    @Transactional
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        User user = getCurrentUser();
        String name = normalizeRequiredName(request.name());
        String color = normalizeColor(request.color());

        if (categoryRepository.existsByUserIdAndNameIgnoreCase(user.getId(), name)) {
            throw new ConflictException("A category with this name already exists.");
        }

        Category category = Category.builder()
                .name(name)
                .color(color)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse updateCategory(Long categoryId, UpdateCategoryRequest request) {
        Category category = getCategoryForCurrentUser(categoryId);
        String name = normalizeRequiredName(request.name());
        String color = normalizeColor(request.color());

        if (categoryRepository.existsByUserIdAndNameIgnoreCaseAndIdNot(category.getUser().getId(), name, categoryId)) {
            throw new ConflictException("A category with this name already exists.");
        }

        category.setName(name);
        category.setColor(color);

        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long categoryId) {
        Category category = getCategoryForCurrentUser(categoryId);
        Long userId = category.getUser().getId();

        sessionRepository.clearCategoryForUserSessions(categoryId, userId);
        categoryRepository.delete(category);
    }

    private Category getCategoryForCurrentUser(Long categoryId) {
        if (categoryId == null) {
            throw new BadRequestException("Category ID is required.");
        }

        Long userId = getCurrentUser().getId();
        return categoryRepository.findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new NotFoundException("Category not found for the authenticated user."));
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UnauthorizedException("Authenticated user not found.");
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found: " + email));
    }

    private String normalizeRequiredName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new BadRequestException("Category name is required.");
        }

        return name.trim();
    }

    private String normalizeColor(String color) {
        if (color == null || color.trim().isEmpty()) {
            return null;
        }

        String normalizedColor = color.trim();
        if (!HEX_COLOR_PATTERN.matcher(normalizedColor).matches()) {
            throw new BadRequestException("Category color must be a valid hex value like #4CAF50.");
        }

        return normalizedColor.toUpperCase();
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getColor(),
                category.getCreatedAt()
        );
    }
}
