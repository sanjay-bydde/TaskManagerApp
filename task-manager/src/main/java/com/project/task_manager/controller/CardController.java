package com.project.task_manager.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.CrossOrigin;
// for frontend access
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.task_manager.entity.Card;
import com.project.task_manager.repository.CardRepository;
import com.project.task_manager.security.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("api/cards")
@CrossOrigin(origins = "http://localhost:3000")
public class CardController {

    private final CardRepository cardRepository;
    private final JwtUtil jwtUtil; // Utility to extract user info from JWT

    public CardController(CardRepository cardRepository, JwtUtil jwtUtil) {
        this.cardRepository = cardRepository;
        this.jwtUtil = jwtUtil;
    }

    // Get all cards for the authenticated user
    @GetMapping
    public List<Card> getAllCards(HttpServletRequest request) {
        String token = extractToken(request);
        String userId = jwtUtil.extractUsername(token); // Assumes username is in token
        return cardRepository.findByUserId(userId);
    }

    // Create new card for authenticated user
    @PostMapping
    public Card createCard(@RequestBody Card card, HttpServletRequest request) {
        String token = extractToken(request);
        String userId = jwtUtil.extractUsername(token);
        card.setUserId(userId); // Assign userId to the card
        return cardRepository.save(card);
    }

    // Update card only if it belongs to the user
    @PutMapping("/{id}")
    public Card updateCard(@PathVariable String id, @RequestBody Card updatedCard, HttpServletRequest request) {
        String token = extractToken(request);
        String userId = jwtUtil.extractUsername(token);
        Optional<Card> optionalCard = cardRepository.findById(id);

        if (optionalCard.isPresent()) {
            Card card = optionalCard.get();
            if (!card.getUserId().equals(userId)) {
                throw new RuntimeException("Unauthorized: Cannot update this card");
            }
            card.setTitle(updatedCard.getTitle());
            card.setDescription(updatedCard.getDescription());
            card.setColumn(updatedCard.getColumn());
            card.setOrder(updatedCard.getOrder());
            return cardRepository.save(card);
        } else {
            throw new RuntimeException("Card not found with id: " + id);
        }
    }

    // Delete card only if it belongs to the user
    @DeleteMapping("/{id}")
    public void deleteCard(@PathVariable String id, HttpServletRequest request) {
        String token = extractToken(request);
        String userId = jwtUtil.extractUsername(token);
        Optional<Card> optionalCard = cardRepository.findById(id);

        if (optionalCard.isPresent()) {
            Card card = optionalCard.get();
            if (!card.getUserId().equals(userId)) {
                throw new RuntimeException("Unauthorized: Cannot delete this card");
            }
            cardRepository.deleteById(id);
        } else {
            throw new RuntimeException("Card not found with id: " + id);
        }
    }

    // Helper to extract token from Authorization header
    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        return header.substring(7);
    }
}
